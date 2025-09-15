export default function FilterCheckbox({ checked, onChange, label }) {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />{label}
    </label>
  );
}