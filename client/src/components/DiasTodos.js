import Wrapper from '../assets/wrappers/Dias';

const DiasTodos = ({ _id,horasPossiveis, NumeroHoras, Utilizador, diaSelected }) => {

  function convertToMinutes(timeString) {
    if (timeString) {
      try {
        let [hours, minutes] = timeString.toString().split(".");

        // Convert the hours to an integer
        const hoursInt = parseInt(hours, 10);
        // Convert the fraction of an hour to minutes
        minutes = parseInt(minutes) < 10 ? `${minutes}0` : minutes;

        if (!minutes) {
          minutes = 0;
        }
        let formattedMinutes = Math.round(minutes * 60) / 100;
        if (formattedMinutes === 60) {
          formattedMinutes = 0;
          // formattedHours += 1;
        }
        // Use String.padStart to format hours and minutes with leading zeros
        const formattedHours = hoursInt.toString().padStart(2, "0");
        formattedMinutes = formattedMinutes.toString().padStart(2, '0');

        const formattedTime = `${formattedHours}:${formattedMinutes}`;

        return formattedTime;
      } catch (error) {
        console.error(error)
        return timeString;
      }
    }
    return timeString;
  }

  const percentagemHoras = horasPossiveis ? (NumeroHoras / horasPossiveis) * 100 : 0;

            return (
                <Wrapper>
                <div key={_id}>
                <div className="dias">
            <div className="list-group-item">

                <div className="row text-center">
                <div className="col-md-3 themed-grid-col">
                    <h4>{Utilizador.nome}</h4>
                </div>

                <div className="col-md-9 themed-grid-col">
                <div className="row text-center">
                    {diaSelected === 0 ? (
                        <>
                    <div className="col-md-6 themed-grid-col">
                    <h4>{convertToMinutes(NumeroHoras)}</h4>
                    </div>

                    <div className="col-md-6 text-center">
                    {percentagemHoras >= 0 && (
                        <p>{percentagemHoras.toFixed(1)}%</p>
                    )}
                    </div>
                    </>
                    ):(
                    <div className="col-md-12 themed-grid-col">
                    <h4>{NumeroHoras}</h4>
                    </div>

                    )}
                    </div>
                </div>
                <hr />
                </div>
            </div>
            </div>
      </div>

    </Wrapper>

  );
};

export default DiasTodos;
