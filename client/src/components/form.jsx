function Calendar() {
  return <div className="calendar"></div>;
}

function FormInput({ label, id, placeholder, required }) {
  return (
    <div className="col-8">
      <input type="text" className="form-control" id={id} placeholder={placeholder} required={required} />
      <div className="invalid-feedback">Insira {label}!</div>
    </div>
  );
}

function SelectInput({ label, id, options, required }) {
  return (
    <div className="col-8">
      <label htmlFor={id} className="form-label">
        {label}
      </label>
      <select className="form-select" id={id} required={required}>
        <option value="">Escolha</option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
      <div className="invalid-feedback">Escolha pelo menos uma tarefa!</div>
    </div>
  );
}

function AddProject() {
    return (
      <div className="container">
        <main>
          <h4 className="mb-3">Adicionar Projeto</h4>
          <div className="row g-5">
            <div className="col-12 col-lg-4 order-md-last">
              <CalendarWrapper />
              <NumberInputWrapper label="Numero de dias" id="numeroDias" />
              <NumberInputWrapper label="Numero total Horas" id="numeroHorasTotal" />
              <NumberInputWrapper label="Numero de dias" id="numeroDias2" />
            </div>
            <div className="col-md-7 col-lg-8">
              <FormWrapper />
            </div>
          </div>
        </main>
      </div>
    );
  }
  
  function CalendarWrapper() {
    return (
      <div className="calendar"></div>
    );
  }
  
  function NumberInputWrapper(props) {
    return (
      <div className="row g-5">
        <div className="col-6">
          <p>{props.label}</p>
        </div>
        <div className="col-6">
          <input style={{ width: '100%' }} type="number" id={props.id} />
        </div>
      </div>
    );
  }
  
  function FormWrapper() {
    return (
      <form className="needs-validation" noValidate>
        <div className="row g-3">
          <div className="col-12"></div>
          </div>
          </form>
    );
}