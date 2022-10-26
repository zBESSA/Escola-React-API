import React, {Component} from 'react';
import axios from 'axios';
import './CrudCurso.css';
import Main from "../template/Main";
import { useState, useEffect } from 'react';

const title = "Cadastro de Cursos";

const urlAPI = "http://localhost:5014/api/curso";

export default function CrudCurso(){
    const initialState = {
        curso: { id: 0, codCurso: '', nomeCurso: '', periodo: ''},
        lista: []
    }

    const [lista, setLista] = useState(initialState.lista)
    const [data, setData] = useState(initialState.curso)
    
    const dadosDaURL = async () =>{
        await axios(urlAPI)
        .then((resp) => setLista(resp.data))
        .catch((err) => {
            console.log(err)
        })
        
    }

    useEffect(() => {
        dadosDaURL()
        console.log(data)
    },[data]) 


    const dadosLimpos = { id: 0, codCurso: 0, nomeCurso: '', periodo: ''}
    const limpar = () => setData(dadosLimpos)

    const pegaDados = e =>{
        const {name, value} = e.target
        setData({
            ...data,
            [name]: value
        })
    }
    // ESCREVE adiciounou ele só n apaga o input

    const salvar = () => {
        const cursoData = {...data}
        data.codCurso = Number(cursoData.codCurso)
        const metodo = data.id ? 'put' : 'post';
        const url = data.id ? `${urlAPI}/${data.id}` : urlAPI;

        axios[metodo](url, cursoData)
            .then(resp => {
                let lista = getListaAtualizada(resp.data)
                setData(data)
                setLista(lista)
            })
    }

    const getListaAtualizada = (curso, add = true) => {
        const lista1 = lista.filter(a => a.id !== curso.id);
        if (add) lista1.unshift(curso);
        return lista1;
    }

    const carregar = (curso) => setData(curso)

    const remover = (curso) => {
        const url = urlAPI + "/" + curso.id;
        if (!window.confirm("Confirma remoção do curso: " + curso.nomeCurso)) return;

        axios['delete'](url, curso)
            .then((_resp) => {
                const lista = getListaAtualizada(curso, false)
                setData({ curso: initialState.curso, lista })
            })
            .catch((err) => {
                console.dir(err)
            });
    }
    
    const renderForm = () => {
        return (
            <div className="inclui-container">

                <label> Código: </label>
                <input
                    type="text"
                    id="codCurso"
                    placeholder="Código do curso"
                    className="form-input tabCodigo"
                    name="codCurso"
                    value={data.codCurso}
                    onChange={pegaDados}
                />

                <label> Nome: </label>
                <input
                    type="text"
                    id="nomeCurso"
                    placeholder="Nome do curso"
                    className="form-input tabNome"
                    name="nomeCurso"
                    value={data.nomeCurso}
                    onChange={pegaDados}
                />

                <label> periodo: </label>
                <input
                    type="text"
                    id="periodo"
                    placeholder="V"
                    className="form-input tabPeriodo"
                    name="periodo"
                    value={data.periodo}
                    onChange={pegaDados}
                />

                <button className="btnSalvar"
                    onClick={e => salvar(e)} >
                        Salvar
                </button>

                <button className="btnCancelar"
                    onClick={e => limpar(e)} >
                        Cancelar
                </button>

            </div>
        )
    }

    const renderTable = () => {
        return(
            <div className="listagem">
                <table className="listaCursos" id="tblListaCursos">
                    <thead>
                        <tr className="cabecTabela">
                            <th className="tabTituloCodigo">Código</th>
                            <th className="tabTituloNome">Nome</th>
                            <th className="tabTituloPeriodo">Periodo</th>
                        </tr>
                    </thead>

                    <tbody>
                        {lista.map(
                            (curso) =>
                            <tr key={curso.id}>
                                <td>{curso.codCurso}</td>
                                <td>{curso.nomeCurso}</td>
                                <td>{curso.periodo}</td>
                                <td>
                                    <button onClick={() => carregar(curso)}>
                                        Altera
                                    </button>
                                </td>
                                <td>
                                    <button onClick={() => remover(curso)}>
                                        Remove
                                    </button>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        )
    }
        return(
            <Main title={title}>
                {renderForm()}
                {renderTable()}
            </Main>
        )

}