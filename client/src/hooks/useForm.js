import { useState } from "react";

export function useForm(initialValues) {
  const [values, setValues] = useState(initialValues);

  function onChange(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function reset() {
    setValues(initialValues);
  }

  return { values, onChange, reset, setValues };
}
