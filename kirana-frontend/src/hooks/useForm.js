import { useState } from 'react';

// Small form helper: values, field binding and a validate() that fills `errors`.
export default function useForm(initial, validate) {
  const [values, setValues] = useState(initial);
  const [errors, setErrors] = useState({});

  const bind = (name) => ({
    value: values[name] ?? '',
    onChange: (e) => setValues({ ...values, [name]: e.target.value }),
  });
  const check = () => {
    const found = validate(values);
    setErrors(found);
    return Object.keys(found).length === 0;
  };
  return { values, setValues, errors, bind, check };
}
