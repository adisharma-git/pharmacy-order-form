import { useState } from "react";

const DRUGS = [
  { code: "ANE100", name: "Aceclan 100mg Tab", generic: "Aceclofenac", packSize: 100, unitCost: 1.05 },
  { code: "ENR250", name: "Eneril 2.5mg Tab", generic: "Enalapril", packSize: 100, unitCost: 0.84 },
  { code: "GAB2020", name: "Gabament 20g Ointment", generic: "Gabapentin", packSize: 20, unitCost: 90.94 },
  { code: "IVT016", name: "Invert 16mg Tab", generic: "Betahistine", packSize: 100, unitCost: 3.24 },
  { code: "NFK0150", name: "Nefrokind Tab", generic: "N-Acetylcysteine+Taurine", packSize: 200, unitCost: 2.80 },
  { code: "NDS01000", name: "Nobinate DS 1gm Tab", generic: "Sodium Bicarbonate", packSize: 100, unitCost: 0.84 },
];

const STEPS = ["Vendor Info", "Order Items", "Review & Submit"];

export default function App() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    vendorName: "",
    vendorEmail: "",
    vendorPhone: "",
    vendorAddress: "",
    poNumber: "",
    poDate: new Date().toISOString().split("T")[0],
    deliveryDate: "",
    paymentTerms: "Net 30",
    notes: "",
  });
  const [items, setItems] = useState([
    { drugCode: "", drugName: "", genericName: "", packSize: "", quantity: "", unitCost: "", total: "" },
  ]);

  const updateForm = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const updateItem = (idx, key, value) => {
    const updated = [...items];
    if (key === "drugCode") {
      const drug = DRUGS.find((d) => d.code === value);
      if (drug) {
        updated[idx] = {
          ...updated[idx],
          drugCode: drug.code,
          drugName: drug.name,
          genericName: drug.generic,
          packSize: drug.packSize,
          unitCost: drug.unitCost,
          total: drug.unitCost * (updated[idx].quantity || 0),
        };
      } else {
        updated[idx] = { ...updated[idx], drugCode: value };
      }
    } else {
      updated[idx] = { ...updated[idx], [key]: value };
      if (key === "quantity") {
        updated[idx].total = (updated[idx].unitCost || 0) * parseFloat(value || 0);
      }
    }
    setItems(updated);
  };

  const addItem = () =>
    setItems([...items, { drugCode: "", drugName: "", genericName: "", packSize: "", quantity: "", unitCost: "", total: "" }]);

  const removeItem = (idx) => setItems(items.filter((_, i) => i !== idx));

  const subtotal = items.reduce((s, i) => s + parseFloat(i.total || 0), 0);
  const tax = subtotal * 0.18;
  const grandTotal = subtotal + tax;

  const handleSubmit = () => setSubmitted(true);

  if (submitted) {
    return (
      <div className="success-screen">
        <div className="success-card">
          <div className="success-icon">✓</div>
          <h1>Order Submitted!</h1>
          <p className="success-po">PO Number: <strong>{form.poNumber || "PO-20260216-AUTO"}</strong></p>
          <p className="success-vendor">Vendor: <strong>{form.vendorName}</strong></p>
          <p className="success-total">Total: <strong>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong></p>
          <p className="success-items">{items.filter(i => i.drugCode).length} items ordered</p>
          <button className="btn-reset" onClick={() => { setSubmitted(false); setStep(0); }}>
            Place Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      {/* Background grid */}
      <div className="bg-grid" />

      {/* Header */}
      <header className="header">
        <div className="header-inner">
          <div className="logo">
            <span className="logo-icon">⚕</span>
            <span className="logo-text">PharmOrder</span>
          </div>
          <div className="header-tagline">Vendor Purchase Order Portal</div>
        </div>
      </header>

      {/* Stepper */}
      <div className="stepper-wrap">
        <div className="stepper">
          {STEPS.map((s, i) => (
            <div key={s} className={`step ${i === step ? "active" : ""} ${i < step ? "done" : ""}`}>
              <div className="step-num">{i < step ? "✓" : i + 1}</div>
              <div className="step-label">{s}</div>
              {i < STEPS.length - 1 && <div className="step-line" />}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <main className="main">
        <div className="card">

          {/* STEP 1: Vendor Info */}
          {step === 0 && (
            <div className="form-section">
              <h2 className="section-title">Vendor Information</h2>
              <p className="section-sub">Enter vendor and purchase order details</p>

              <div className="grid-2">
                <div className="field">
                  <label>PO Number</label>
                  <input id="po_number" name="po_number" placeholder="PO-2026-XXXX"
                    value={form.poNumber} onChange={e => updateForm("poNumber", e.target.value)} />
                </div>
                <div className="field">
                  <label>PO Date</label>
                  <input id="po_date" name="po_date" type="date"
                    value={form.poDate} onChange={e => updateForm("poDate", e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Vendor Name</label>
                <input id="vendor_name" name="vendor_name" placeholder="e.g. Anthus Pharmaceuticals"
                  value={form.vendorName} onChange={e => updateForm("vendorName", e.target.value)} />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Vendor Email</label>
                  <input id="vendor_email" name="vendor_email" type="email" placeholder="orders@vendor.com"
                    value={form.vendorEmail} onChange={e => updateForm("vendorEmail", e.target.value)} />
                </div>
                <div className="field">
                  <label>Vendor Phone</label>
                  <input id="vendor_phone" name="vendor_phone" placeholder="+91-XX-XXXX-XXXX"
                    value={form.vendorPhone} onChange={e => updateForm("vendorPhone", e.target.value)} />
                </div>
              </div>

              <div className="field">
                <label>Vendor Address</label>
                <input id="vendor_address" name="vendor_address" placeholder="Full vendor address"
                  value={form.vendorAddress} onChange={e => updateForm("vendorAddress", e.target.value)} />
              </div>

              <div className="grid-2">
                <div className="field">
                  <label>Expected Delivery Date</label>
                  <input id="delivery_date" name="delivery_date" type="date"
                    value={form.deliveryDate} onChange={e => updateForm("deliveryDate", e.target.value)} />
                </div>
                <div className="field">
                  <label>Payment Terms</label>
                  <select id="payment_terms" name="payment_terms"
                    value={form.paymentTerms} onChange={e => updateForm("paymentTerms", e.target.value)}>
                    <option>Net 30</option>
                    <option>Net 15</option>
                    <option>Net 60</option>
                    <option>Immediate</option>
                    <option>COD</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Notes / Special Instructions</label>
                <textarea id="notes" name="notes" placeholder="Any special delivery or handling notes..."
                  rows={3} value={form.notes} onChange={e => updateForm("notes", e.target.value)} />
              </div>

              <div className="btn-row">
                <button className="btn-primary" onClick={() => setStep(1)}>
                  Next: Add Items →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Order Items */}
          {step === 1 && (
            <div className="form-section">
              <h2 className="section-title">Order Items</h2>
              <p className="section-sub">Add drugs and quantities for this purchase order</p>

              <div className="items-table">
                <div className="items-header">
                  <span>Drug Code</span>
                  <span>Drug Name</span>
                  <span>Generic Name</span>
                  <span>Pack Size</span>
                  <span>Qty</span>
                  <span>Unit Cost (₹)</span>
                  <span>Total (₹)</span>
                  <span></span>
                </div>

                {items.map((item, idx) => (
                  <div className="items-row" key={idx}>
                    <div className="field-inline">
                      <select
                        id={`drug_code_${idx}`}
                        name={`drug_code_${idx}`}
                        value={item.drugCode}
                        onChange={e => updateItem(idx, "drugCode", e.target.value)}
                      >
                        <option value="">Select...</option>
                        {DRUGS.map(d => (
                          <option key={d.code} value={d.code}>{d.code}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field-inline">
                      <input id={`drug_name_${idx}`} name={`drug_name_${idx}`}
                        placeholder="Drug name" value={item.drugName}
                        onChange={e => updateItem(idx, "drugName", e.target.value)} />
                    </div>
                    <div className="field-inline">
                      <input id={`generic_name_${idx}`} name={`generic_name_${idx}`}
                        placeholder="Generic" value={item.genericName}
                        onChange={e => updateItem(idx, "genericName", e.target.value)} />
                    </div>
                    <div className="field-inline">
                      <input id={`pack_size_${idx}`} name={`pack_size_${idx}`}
                        placeholder="Pack" value={item.packSize}
                        onChange={e => updateItem(idx, "packSize", e.target.value)} />
                    </div>
                    <div className="field-inline">
                      <input id={`quantity_${idx}`} name={`quantity_${idx}`}
                        type="number" placeholder="Qty" value={item.quantity}
                        onChange={e => updateItem(idx, "quantity", e.target.value)} />
                    </div>
                    <div className="field-inline">
                      <input id={`unit_cost_${idx}`} name={`unit_cost_${idx}`}
                        placeholder="₹0.00" value={item.unitCost}
                        onChange={e => updateItem(idx, "unitCost", e.target.value)} />
                    </div>
                    <div className="field-inline total-cell">
                      ₹{parseFloat(item.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                    </div>
                    <button className="btn-remove" onClick={() => removeItem(idx)}
                      disabled={items.length === 1}>✕</button>
                  </div>
                ))}
              </div>

              <button className="btn-add-item" onClick={addItem}>+ Add Another Item</button>

              <div className="totals-box">
                <div className="total-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
                <div className="total-row"><span>Tax (18% GST)</span><span>₹{tax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
                <div className="total-row grand"><span>Grand Total</span><span>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span></div>
              </div>

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setStep(0)}>← Back</button>
                <button className="btn-primary" onClick={() => setStep(2)}>Review Order →</button>
              </div>
            </div>
          )}

          {/* STEP 3: Review */}
          {step === 2 && (
            <div className="form-section">
              <h2 className="section-title">Review & Submit</h2>
              <p className="section-sub">Confirm your purchase order details before submitting</p>

              <div className="review-grid">
                <div className="review-block">
                  <h3>Vendor Details</h3>
                  <div className="review-row"><span>PO Number</span><strong>{form.poNumber || "—"}</strong></div>
                  <div className="review-row"><span>Vendor</span><strong>{form.vendorName || "—"}</strong></div>
                  <div className="review-row"><span>Email</span><strong>{form.vendorEmail || "—"}</strong></div>
                  <div className="review-row"><span>Phone</span><strong>{form.vendorPhone || "—"}</strong></div>
                  <div className="review-row"><span>Delivery Date</span><strong>{form.deliveryDate || "—"}</strong></div>
                  <div className="review-row"><span>Payment</span><strong>{form.paymentTerms}</strong></div>
                </div>

                <div className="review-block">
                  <h3>Order Summary</h3>
                  {items.filter(i => i.drugCode).map((item, idx) => (
                    <div className="review-row" key={idx}>
                      <span>{item.drugCode} × {item.quantity}</span>
                      <strong>₹{parseFloat(item.total || 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                    </div>
                  ))}
                  <div className="review-divider" />
                  <div className="review-row grand-review">
                    <span>Grand Total (incl. GST)</span>
                    <strong>₹{grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</strong>
                  </div>
                </div>
              </div>

              {form.notes && (
                <div className="notes-preview">
                  <strong>Notes:</strong> {form.notes}
                </div>
              )}

              <div className="btn-row">
                <button className="btn-secondary" onClick={() => setStep(1)}>← Edit Items</button>
                <button id="submit_order" className="btn-submit" onClick={handleSubmit}>
                  ✓ Submit Purchase Order
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Syne:wght@400;600;700;800&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        :root {
          --bg: #0a0e1a;
          --surface: #111827;
          --surface2: #1a2235;
          --border: #1e2d45;
          --accent: #00d4aa;
          --accent2: #0ea5e9;
          --text: #e8f0fe;
          --muted: #6b7fa3;
          --danger: #ef4444;
          --gold: #f59e0b;
        }

        body {
          font-family: 'Syne', sans-serif;
          background: var(--bg);
          color: var(--text);
          min-height: 100vh;
        }

        .app { min-height: 100vh; position: relative; overflow-x: hidden; }

        .bg-grid {
          position: fixed; inset: 0; pointer-events: none; z-index: 0;
          background-image:
            linear-gradient(rgba(0, 212, 170, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 212, 170, 0.03) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        /* Header */
        .header {
          position: relative; z-index: 10;
          border-bottom: 1px solid var(--border);
          background: rgba(10, 14, 26, 0.95);
          backdrop-filter: blur(12px);
        }
        .header-inner {
          max-width: 1000px; margin: 0 auto;
          padding: 18px 24px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .logo { display: flex; align-items: center; gap: 10px; }
        .logo-icon { font-size: 24px; }
        .logo-text {
          font-size: 20px; font-weight: 800;
          background: linear-gradient(135deg, var(--accent), var(--accent2));
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          letter-spacing: -0.5px;
        }
        .header-tagline { font-size: 13px; color: var(--muted); font-family: 'DM Mono', monospace; }

        /* Stepper */
        .stepper-wrap {
          position: relative; z-index: 10;
          padding: 32px 24px 0;
          max-width: 1000px; margin: 0 auto;
        }
        .stepper { display: flex; align-items: center; gap: 0; }
        .step {
          display: flex; align-items: center; gap: 10px;
          flex: 1; position: relative;
        }
        .step-num {
          width: 36px; height: 36px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 700; flex-shrink: 0;
          border: 2px solid var(--border);
          background: var(--surface); color: var(--muted);
          transition: all 0.3s;
        }
        .step.active .step-num {
          border-color: var(--accent); color: var(--accent);
          box-shadow: 0 0 20px rgba(0, 212, 170, 0.3);
          background: rgba(0, 212, 170, 0.1);
        }
        .step.done .step-num {
          border-color: var(--accent); background: var(--accent); color: #0a0e1a;
        }
        .step-label { font-size: 13px; color: var(--muted); font-weight: 600; white-space: nowrap; }
        .step.active .step-label { color: var(--accent); }
        .step.done .step-label { color: var(--text); }
        .step-line {
          flex: 1; height: 2px; background: var(--border);
          margin: 0 12px; min-width: 20px;
        }

        /* Main */
        .main {
          position: relative; z-index: 10;
          max-width: 1000px; margin: 0 auto;
          padding: 28px 24px 60px;
        }
        .card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 24px 80px rgba(0,0,0,0.5);
        }
        .form-section { padding: 36px; }

        .section-title {
          font-size: 22px; font-weight: 800;
          color: var(--text); margin-bottom: 4px;
        }
        .section-sub { font-size: 14px; color: var(--muted); margin-bottom: 28px; }

        /* Fields */
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .field { display: flex; flex-direction: column; gap: 6px; margin-bottom: 16px; }
        .field label { font-size: 12px; font-weight: 600; color: var(--muted); text-transform: uppercase; letter-spacing: 0.8px; }

        input, select, textarea {
          background: var(--surface2);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text);
          font-family: 'DM Mono', monospace;
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: all 0.2s;
          width: 100%;
        }
        input::placeholder, textarea::placeholder { color: #3a4d6a; }
        input:focus, select:focus, textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 3px rgba(0,212,170,0.12);
          background: #141e2e;
        }
        select { cursor: pointer; appearance: none;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236b7fa3' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat; background-position: right 12px center;
        }

        /* Items Table */
        .items-table { border: 1px solid var(--border); border-radius: 10px; overflow: hidden; margin-bottom: 16px; }
        .items-header {
          display: grid;
          grid-template-columns: 120px 1fr 1fr 80px 80px 110px 110px 40px;
          gap: 8px; padding: 10px 14px;
          background: var(--surface2);
          border-bottom: 1px solid var(--border);
          font-size: 11px; font-weight: 700; color: var(--muted);
          text-transform: uppercase; letter-spacing: 0.8px;
        }
        .items-row {
          display: grid;
          grid-template-columns: 120px 1fr 1fr 80px 80px 110px 110px 40px;
          gap: 8px; padding: 8px 14px; align-items: center;
          border-bottom: 1px solid var(--border);
          transition: background 0.15s;
        }
        .items-row:last-child { border-bottom: none; }
        .items-row:hover { background: rgba(0,212,170,0.03); }
        .field-inline input, .field-inline select { margin-bottom: 0; padding: 8px 10px; font-size: 13px; }
        .total-cell {
          font-family: 'DM Mono', monospace; font-size: 13px;
          color: var(--accent); font-weight: 500; text-align: right;
        }
        .btn-remove {
          background: none; border: 1px solid var(--border);
          color: var(--muted); border-radius: 6px;
          width: 30px; height: 30px; cursor: pointer; font-size: 11px;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.15s;
        }
        .btn-remove:hover:not(:disabled) { border-color: var(--danger); color: var(--danger); }
        .btn-remove:disabled { opacity: 0.3; cursor: not-allowed; }

        .btn-add-item {
          background: none; border: 1px dashed var(--border);
          color: var(--accent2); padding: 10px 20px;
          border-radius: 8px; cursor: pointer; font-size: 13px;
          font-family: 'Syne', sans-serif; font-weight: 600;
          transition: all 0.2s; width: 100%; margin-bottom: 24px;
        }
        .btn-add-item:hover { border-color: var(--accent2); background: rgba(14,165,233,0.06); }

        /* Totals */
        .totals-box {
          margin-left: auto; width: 340px;
          border: 1px solid var(--border); border-radius: 10px;
          overflow: hidden; margin-bottom: 28px;
        }
        .total-row {
          display: flex; justify-content: space-between;
          padding: 10px 16px; font-size: 14px;
          border-bottom: 1px solid var(--border);
        }
        .total-row:last-child { border-bottom: none; }
        .total-row span { color: var(--muted); }
        .total-row.grand {
          background: rgba(0,212,170,0.08);
          font-size: 16px; font-weight: 700;
        }
        .total-row.grand span { color: var(--text); }
        .total-row.grand span:last-child { color: var(--accent); }

        /* Buttons */
        .btn-row { display: flex; justify-content: flex-end; gap: 12px; padding-top: 8px; }
        .btn-primary, .btn-secondary, .btn-submit {
          padding: 12px 28px; border-radius: 10px;
          font-family: 'Syne', sans-serif; font-size: 14px;
          font-weight: 700; cursor: pointer;
          transition: all 0.2s; border: none;
        }
        .btn-primary {
          background: linear-gradient(135deg, var(--accent), #00b894);
          color: #0a0e1a;
          box-shadow: 0 4px 20px rgba(0,212,170,0.3);
        }
        .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 6px 28px rgba(0,212,170,0.45); }
        .btn-secondary {
          background: var(--surface2); border: 1px solid var(--border);
          color: var(--muted);
        }
        .btn-secondary:hover { border-color: var(--accent2); color: var(--text); }
        .btn-submit {
          background: linear-gradient(135deg, var(--gold), #ef6c00);
          color: #0a0e1a; font-size: 15px;
          box-shadow: 0 4px 24px rgba(245,158,11,0.3);
        }
        .btn-submit:hover { transform: translateY(-1px); box-shadow: 0 6px 32px rgba(245,158,11,0.5); }

        /* Review */
        .review-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
        .review-block {
          background: var(--surface2); border: 1px solid var(--border);
          border-radius: 12px; padding: 20px;
        }
        .review-block h3 {
          font-size: 13px; text-transform: uppercase; letter-spacing: 1px;
          color: var(--accent); margin-bottom: 14px; font-weight: 700;
        }
        .review-row {
          display: flex; justify-content: space-between; align-items: center;
          padding: 7px 0; border-bottom: 1px solid rgba(30,45,69,0.8);
          font-size: 13px;
        }
        .review-row:last-child { border-bottom: none; }
        .review-row span { color: var(--muted); }
        .review-row strong { color: var(--text); font-family: 'DM Mono', monospace; }
        .review-divider { border-top: 1px solid var(--border); margin: 10px 0; }
        .grand-review span, .grand-review strong { font-size: 15px !important; font-weight: 800; }
        .grand-review strong { color: var(--accent) !important; }

        .notes-preview {
          background: var(--surface2); border: 1px solid var(--border);
          border-left: 3px solid var(--accent2);
          border-radius: 8px; padding: 14px 16px;
          font-size: 13px; color: var(--muted); margin-bottom: 24px;
        }

        /* Success */
        .success-screen {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center;
          background: var(--bg); padding: 24px;
          position: relative;
        }
        .success-screen::before {
          content: ''; position: fixed; inset: 0;
          background-image: linear-gradient(rgba(0,212,170,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,170,0.03) 1px, transparent 1px);
          background-size: 40px 40px; pointer-events: none;
        }
        .success-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 56px 48px;
          text-align: center; max-width: 480px; width: 100%;
          box-shadow: 0 32px 80px rgba(0,0,0,0.6);
          position: relative;
        }
        .success-icon {
          width: 72px; height: 72px; border-radius: 50%;
          background: linear-gradient(135deg, var(--accent), #00b894);
          display: flex; align-items: center; justify-content: center;
          font-size: 30px; color: #0a0e1a; font-weight: 900;
          margin: 0 auto 24px;
          box-shadow: 0 8px 32px rgba(0,212,170,0.4);
        }
        .success-card h1 { font-size: 28px; font-weight: 800; margin-bottom: 20px; }
        .success-po { color: var(--muted); margin-bottom: 8px; font-size: 15px; }
        .success-vendor { color: var(--muted); margin-bottom: 8px; font-size: 15px; }
        .success-total { font-size: 22px; color: var(--accent); margin-bottom: 6px; font-weight: 700; }
        .success-items { color: var(--muted); font-size: 14px; margin-bottom: 32px; }
        .btn-reset {
          background: none; border: 1px solid var(--border);
          color: var(--muted); padding: 12px 28px;
          border-radius: 10px; cursor: pointer;
          font-family: 'Syne', sans-serif; font-size: 14px; font-weight: 600;
          transition: all 0.2s;
        }
        .btn-reset:hover { border-color: var(--accent2); color: var(--text); }

        @media (max-width: 768px) {
          .grid-2 { grid-template-columns: 1fr; }
          .review-grid { grid-template-columns: 1fr; }
          .items-header, .items-row { grid-template-columns: 100px 1fr 60px 60px 36px; }
          .items-header span:nth-child(3), .items-header span:nth-child(6),
          .items-row .field-inline:nth-child(3), .items-row .field-inline:nth-child(6) { display: none; }
          .totals-box { width: 100%; }
          .stepper-wrap { display: none; }
        }
      `}</style>
    </div>
  );
}
