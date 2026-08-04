import React, { useEffect, useMemo, useState } from "react";

const createEmptyForm = (fields) =>
  fields.reduce((accumulator, field) => {
    accumulator[field.name] = "";
    return accumulator;
  }, {});

const formatCellValue = (value, column) => {
  if (column === "budget") {
    const numericValue = Number(value || 0);
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(numericValue);
  }

  if (column === "progress") {
    return `${value || 0}%`;
  }

  return value || "-";
};

export default function AdminRecordsPanel({ config }) {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(() =>
    createEmptyForm(config.fields),
  );

  useEffect(() => {
    const storedValue = localStorage.getItem(config.storageKey);
    if (storedValue) {
      try {
        setItems(JSON.parse(storedValue));
        return;
      } catch {
        localStorage.removeItem(config.storageKey);
      }
    }

    setItems(config.seed);
  }, [config.seed, config.storageKey]);

  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(config.storageKey, JSON.stringify(items));
    }
  }, [config.storageKey, items]);

  const filteredItems = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return items;

    return items.filter((item) =>
      Object.values(item).some((value) =>
        String(value).toLowerCase().includes(term),
      ),
    );
  }, [items, searchTerm]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData(createEmptyForm(config.fields));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextRecord = {
      id: editingId || `${config.storageKey}-${Date.now()}`,
      ...formData,
    };

    setItems((previous) => {
      const existingIndex = previous.findIndex((item) => item.id === editingId);
      if (existingIndex >= 0) {
        const updated = [...previous];
        updated[existingIndex] = nextRecord;
        return updated;
      }

      return [nextRecord, ...previous];
    });

    resetForm();
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData(() => {
      const nextForm = createEmptyForm(config.fields);
      config.fields.forEach((field) => {
        nextForm[field.name] = item[field.name] || "";
      });
      return nextForm;
    });
  };

  const handleDelete = (itemId) => {
    const confirmed = window.confirm("Delete this record permanently?");
    if (!confirmed) return;

    setItems((previous) => previous.filter((item) => item.id !== itemId));
    if (editingId === itemId) {
      resetForm();
    }
  };

  return (
    <div className="records-manager fade-in">
      <div className="records-manager-header">
        <div>
          <h2>{config.title}</h2>
          <p>{config.description}</p>
        </div>
        <div className="records-manager-summary">
          <span>{items.length} total records</span>
          <span>{filteredItems.length} visible</span>
        </div>
      </div>

      <div className="records-manager-toolbar">
        <input
          type="search"
          className="records-search"
          placeholder={`Search ${config.title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
        <button type="button" className="secondary-btn" onClick={resetForm}>
          Clear Form
        </button>
      </div>

      <div className="records-manager-grid">
        <section className="records-panel">
          <div className="records-table-wrap">
            <table className="records-table">
              <thead>
                <tr>
                  {config.columns.map((column) => (
                    <th key={column}>{column}</th>
                  ))}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length === 0 ? (
                  <tr>
                    <td
                      colSpan={config.columns.length + 1}
                      className="empty-table-state"
                    >
                      No records found.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item) => (
                    <tr key={item.id}>
                      {config.columns.map((column) => (
                        <td key={column}>
                          {formatCellValue(item[column], column)}
                        </td>
                      ))}
                      <td>
                        <div className="record-actions">
                          <button
                            type="button"
                            className="small-btn"
                            onClick={() => handleEdit(item)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="small-btn danger"
                            onClick={() => handleDelete(item.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <aside className="records-panel records-form-panel">
          <h3>{editingId ? "Update Record" : "Add Record"}</h3>
          <form onSubmit={handleSubmit} className="records-form">
            {config.fields.map((field) => (
              <label key={field.name} className="records-field">
                <span>
                  {field.label}
                  {field.required ? " *" : ""}
                </span>

                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                  >
                    <option value="">Select {field.label.toLowerCase()}</option>
                    {field.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : field.type === "textarea" ? (
                  <textarea
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    rows="4"
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={formData[field.name]}
                    onChange={handleChange}
                    required={field.required}
                    placeholder={`Enter ${field.label.toLowerCase()}`}
                  />
                )}
              </label>
            ))}

            <div className="records-form-actions">
              <button type="submit" className="primary-btn">
                {editingId ? "Save Changes" : "Create Record"}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={resetForm}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
