import { useState, useEffect, memo } from 'react';
import { useDispatch } from 'react-redux';
import { getTipoTrabalho, createTipoTrabalho, deleteTipoTrabalho, editTipoTrabalho } from '@/features/tipoTrabalho/tipoTrabalhoSlice';
import { AiFillDelete } from 'react-icons/ai';
import Wrapper from '@/styles/GerirTipoTrabalho';
import FormRowListaTipoTrabalho from '@/components/forms/FormRowListaTipoTrabalho';
import FormRowSelectTipo from '@/components/forms/FormRowSelectTipo';
import { PageHeader, SectionCard, AppButton, AppInput, ConfirmDialog } from '@/components/ui';
import { toast } from 'react-toastify';




const GerirTipoTrabalho =  () => {
  const [listaTipoTrabalho, setListaTipoTrabalho] = useState([]);
  const [initialState, setInitialState] = useState([]);
  const [verificaAlterado, setVerificaAlterado] = useState({});
  const dispatch = useDispatch();
  const [callUseEffect, setCallUseEffect] = useState();


  useEffect(() => {
    dispatch(getTipoTrabalho()).then((res) => {
      const tipoTrabalhoArray = Array.isArray(res.payload.tipoTrabalho) ? res.payload.tipoTrabalho : [];
      setListaTipoTrabalho(tipoTrabalhoArray);
      setInitialState(tipoTrabalhoArray);
    });
  }, [dispatch]);
  //let StringListaTrabalho = listaTipoTrabalho.map(item => item.TipoTrabalho).join(",");




  const handleLista = async (e) => {
    await dispatch(createTipoTrabalho(e));
    setCallUseEffect(!callUseEffect);
  }

  const [ttToDelete, setTtToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!ttToDelete) return;
    setDeleting(true);
    try {
      const result = await dispatch(deleteTipoTrabalho(ttToDelete._id));
      if (!result.error) {
        // reload to refresh the list (unchanged behaviour)
        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
      toast.error("Ocorreu um erro ao apagar o Tipo de Trabalho.");
    } catch (error) {
      console.error(error);
      toast.error("Ocorreu um erro ao apagar o Tipo de Trabalho.");
    }
    setDeleting(false);
    setTtToDelete(null);
  };
  
  const alterarTipoTrabalho = async (tt) => {
    if (!tt.TipoTrabalho) {
      toast.error('Por favor, não insira um tipo de trabalho vazio!');
      setVerificaAlterado(false);
      return setListaTipoTrabalho(initialState);
    }
    try {
      const result = await dispatch(editTipoTrabalho(tt));

      if (!result.error) {
        const ttpos = initialState.findIndex(item => item._id === tt._id);
        if (ttpos !== -1) {
          const updatedState = [...initialState]; // Create a copy of the initialState array
          updatedState[ttpos] = tt; // Update the specific element
        
          setInitialState(updatedState); // Set the new state
        }

        setVerificaAlterado(false);
        setCallUseEffect(!callUseEffect);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const [newOption, setNewOption] = useState(''); // state to hold new option value



  const handleNewOptionChange = (event) => {
    setNewOption(event.target.value);
  };


  const handleChangeTipoTrabalho = (e, id) => {
    const value = e.target.value;
    const name = e.target.name;
  
    const updatedListaTipoTrabalho = listaTipoTrabalho.map((item, i) => {
      if (item._id === id) {
        if(name === "tipoT"){
          let valueTipo;
          if(value === "Projetos"){
            valueTipo = 1
          }else if(value === "Geral"){
            valueTipo = 2
          }else if(value === "Outro"){
            valueTipo = 3
          }else if(value === "Extra"){
            valueTipo = 5
          }else if(value === "Compensação Domingo"){
            valueTipo = 6
          }else if(value === "Ferias"){
            valueTipo = 7
          }else
          {
            valueTipo = 4
          }

          if (initialState[i]._id === id && initialState[i].tipo === valueTipo) {
            setVerificaAlterado((prevState) => ({
              ...prevState,
              [id]: false,
            }));
        } else{
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          }
          return { ...item, tipo: valueTipo };
        }
        if (initialState[i]._id === id && initialState[i].TipoTrabalho === value) {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: false,
          }));
          return { ...item, TipoTrabalho: value };
        } else {
          setVerificaAlterado((prevState) => ({
            ...prevState,
            [id]: true,
          }));
          return { ...item, TipoTrabalho: value };
        }
      }
      return item;
    });

    setListaTipoTrabalho(updatedListaTipoTrabalho);
  };
  const handleAddToList = () => {
    if (newOption.trim() !== '') {
      const lowercaseOption = newOption.trim().toLowerCase();
      const newList = [...listaTipoTrabalho, {
        _id: listaTipoTrabalho.length + 1,
        TipoTrabalho: newOption,
        tipo: 1,
        __v: 0
      }];

      if (listaTipoTrabalho.some(item => item.TipoTrabalho.toLowerCase() === lowercaseOption)) {
        alert('Este tipo de Trabalho ' + newOption + ' já existe.');
        setNewOption('');
        return;
      }
      setListaTipoTrabalho(newList);
      handleLista(newOption.trim());
      setNewOption('');
    }
  };

  return (
    <Wrapper>
      <PageHeader
        title="Tipos de Trabalho"
        subtitle="Gerir os tipos de trabalho disponíveis"
      />

      <div className="listaTiposTrabalho">
        {listaTipoTrabalho.map((t, i) => (
          <div className="tt-card" key={i}>
            <div className="tt-card-fields" key={i + "tt"}>
              <FormRowListaTipoTrabalho
                type="textarea"
                id="TipoTrabalhoProjeto"
                name="TipoTrabalho"
                value={t.TipoTrabalho}
                keyGet={`tt-${i}`}
                handleChange={(e) => handleChangeTipoTrabalho(e, t._id)}
              />
              <div className="tiposTrabalho" key={i + "stt"}>
                <FormRowSelectTipo
                  type="text"
                  className="col-md-12"
                  labelText=" "
                  id="tipo"
                  name="tipoT"
                  handleChange={(e) => handleChangeTipoTrabalho(e, t._id)}
                  placeholder="Escolha um tipo"
                  value={t.tipo}
                  key={`sttKey-${t._id}`}
                  keyGet={`${t._id}`}
                  list={[["Projetos"], ["Geral"], ["Outro"], ["Compensação"], ["Extra"], ["Compensação Domingo"], ["Ferias"]]}
                />
              </div>
            </div>

            <div className="tt-actions">
              {verificaAlterado[t._id] === true ? (
                <AppButton size="sm" onClick={() => alterarTipoTrabalho(t)}>
                  Alterar
                </AppButton>
              ) : (
                (t.tipo !== 5 && t.tipo !== 4 && t.tipo !== 6) && (
                  <AppButton
                    size="sm"
                    variant="danger"
                    onClick={() => setTtToDelete(t)}
                    aria-label={`Apagar ${t.TipoTrabalho}`}
                  >
                    <AiFillDelete />
                  </AppButton>
                )
              )}
            </div>
          </div>
        ))}
      </div>

      <SectionCard title="Adicionar tipo de trabalho">
        <div className="tt-add">
          <AppInput
            type="text"
            id="novoTrabalho"
            value={newOption}
            onChange={handleNewOptionChange}
            placeholder="Nome do novo tipo de trabalho…"
            onKeyDown={(e) => e.key === 'Enter' && handleAddToList()}
          />
          <AppButton onClick={handleAddToList}>Adicionar</AppButton>
        </div>
      </SectionCard>

      <ConfirmDialog
        open={!!ttToDelete}
        title="Apagar tipo de trabalho?"
        message={
          ttToDelete
            ? `Tem a certeza que deseja apagar o tipo de trabalho "${ttToDelete.TipoTrabalho}"?`
            : ''
        }
        variant="danger"
        confirmLabel="Apagar"
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTtToDelete(null)}
      />
    </Wrapper>
  );
};

export default memo(GerirTipoTrabalho);