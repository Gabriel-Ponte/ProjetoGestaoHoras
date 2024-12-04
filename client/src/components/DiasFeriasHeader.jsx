
import Wrapper from '../assets/wrappers/DiasFeriasHeader';

const DiasFeriasHeader = ({ color2, color3, color4, color5, color6 }) => {
    
    return (
        <Wrapper>
            <>
                <div className='col-1'></div>
                <div className='col-12 mb-2'>
                {/* <div className='row'>
                    
                <div className='col-2'>
                    <div className='row'>
                        <div className='col-9 text-end'>
                            <p style={{ margin: "auto" }}>1</p>
                        </div>
                        <div className='col-3'>
                            <p className='colored' style={{ backgroundColor: 'black' , margin: "auto"}}></p>
                        </div>
                    </div>
                     </div>

                    <div className='col-2'>
                    <div className='row'>
                        <div className='col-6 text-end'>
                            <p  style={{ margin: "auto" }}> 2</p>
                        </div>
                        <div className='col-6'>
                            <p className='colored' style={{ backgroundColor: color2 , margin: "auto"  }}></p>
                        </div>
                    </div>
                    </div>

                    <div className='col-2'>
                    <div className='row'>
                        <div className='col-9 text-end'>
                            <p  style={{ margin: "auto" }}>3</p>
                        </div>
                        <div className='col-3'>
                            <p className='colored' style={{ backgroundColor: color3, margin: "auto"  }}></p>
                        </div>
                    </div>
                    </div>

                    <div className='col-2'>
                    <div className='row'>
                        <div className='col-9 text-end'>
                            <p  style={{ margin: "auto" }}>4</p>
                        </div>
                        <div className='col-3'>
                            <p className='colored' style={{ backgroundColor: color4, margin: "auto"  }}></p>
                        </div>
                    </div>
                    </div>

                    <div className='col-2'>
                    <div className='row'>
                        <div className='col-9 text-end'>
                            <p  style={{ margin: "auto" }}>5</p>
                        </div>
                        <div className='col-3'>
                            <p className='colored' style={{ backgroundColor: color5, margin: "auto"  }}></p>
                        </div>
                    </div>
                    </div>

                    <div className='col-2'>
                    <div className='row'>
                        <div className='col-9 text-end'>
                            <p  style={{ margin: "auto" }}>+5</p>
                        </div>
                        <div className='col-3'>
                            <p className='colored' style={{ backgroundColor: color6, margin: "auto"  }}></p>
                        </div>
                    </div>
                    </div>


                </div> */}
                </div>

                <div className="ListaProjetosHeader">
                    <div className="list-group-item">
                        <div className="row text-center">
                            <div className="col-md-3 themed-grid-col" style={{ margin: "auto" }}>
                                <button type="button" className="btn buttonHeader">
                                    Utilizador
                                </button>
                            </div>

                            <div className="col-md-9 themed-grid-col">
                                <div className="row text-center">
                                    <div className="col-md-6 themed-grid-col" style={{ margin: "auto" }}>
                                        <button type="button" className="btn buttonHeader">
                                            Numero Dias
                                        </button>
                                    </div>
                                    <div className="col-md-6 themed-grid-col" style={{ margin: "auto" }}>
                                        <button type="button" className="btn buttonHeader">
                                           Lista de Dias
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr />
                    </div>
                </div>

            </>


        </Wrapper>
    );
}


DiasFeriasHeader.propTypes = {

}

export default DiasFeriasHeader;