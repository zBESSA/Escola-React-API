import React, {Component} from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './CrudCarometro.css';
import Header from "../template/Header"
import Main from "../template/Main"

const urlAPI = 'http://localhost:5014/api/aluno';
const urlCurso = "http://localhost:5014/api/curso";

const titulo = "Carômetro do alunos cadastrados";

const AleatCarometro = () => {return Math.random().toString(36).substring(2, 9);}

export default function CrudCarometro(props) {
    const initialState = {
        curso: { id: 0, codCurso: "",nomeCurso: "",periodo: "" },
        listaAlunos: [],
        listaCursos: [],
    }

    const [listaAlunos, setListaAlunos] = useState(initialState.listaAlunos);
    const [listaCursos, setListaCursos] = useState(initialState.listaCursos);
    const [curso, setCurso] = useState(initialState.curso);


    useEffect(() => {
        axios(urlCurso)
            .then((resp) => setListaCursos(resp.data))
        },[]
    );

    const filtroDeAlunos = async (event) => {
        curso.codCurso = event.target.value;
        setCurso(curso)

        const ListaAlunos = await axios(urlAPI)
        .then((resp) => {
            const listaDeAlunos = resp.data;
            return listaDeAlunos.filter(
                (aluno) => aluno.codCurso == curso.codCurso
            );
        })

        setListaAlunos(ListaAlunos)
    }

    const renderSelect = () => {
        return (
            <div className="areacurso">
                <label> Curso: </label>
                <select className="selectCarometro" value={curso.codCurso}  onChange={e => { filtroDeAlunos(e)}} required>
                <option  value="" key="" disabled={true}>  Selecione o curso desejado... </option>
                    {listaCursos.map( (curso) =>
                            <option  key={curso.id} name="codCurso" value={curso.codCurso}>
                                { curso.codCurso } / { curso.nomeCurso } / { curso.periodo }
                            </option>
                    )}
                </select>
            </div>
        );
    };


    const renderCards = () =>(
        <div className="grupoDasCards">
            {
            listaAlunos.map((aluno) => (
                <div key={aluno.id} className="card draw-border">
                    <img  className="cardFoto" src={`https://avatars.dicebear.com/api/miniavs/${AleatCarometro()}.svg`} alt={`Avatar de `+ aluno.nome}/>
                    <span className="cardDados">Ra: {aluno.ra}</span>
                    <span className="cardNome">{aluno.nome}</span>
                    <span className="cardDados">Cursando: {aluno.codCurso}</span>
                </div>
            ))}
        </div>
    )

    return (
        <div className="container carometro">
            <Main title={titulo}>
                <div className="card-container">
                    {renderSelect()}
                    {renderCards()}
                </div>
            </Main>
        </div>
    );
}
