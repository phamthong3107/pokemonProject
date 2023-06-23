import React, { useEffect, useState } from 'react';
import './App.css';
import axios from "axios";
import PokemonColection from './componets/PokemonColection';
import { Pokemon } from './interface';
interface Pokemons {
  name:string,
  url:string
}
export interface Detail {
  id:number,
  isOpen:boolean
}
const App:React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [nextUrl, setNextUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [viewDetail, setDetail] = useState<Detail>({
    id:0,
    isOpen:false,
  })
  useEffect(() => {
    const getPokemon = async () => {
      const res = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=20&offset=20");
      setNextUrl(res.data.next)
      res.data.results.forEach(async(pokemon:Pokemons) => {
        const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`);
        setPokemons((p) => [...p,poke.data])
        setLoading(false)
      })
    }
    getPokemon();
  }, [])
  const loadPokemon = async () => {
    setLoading(true)
    let res = await axios.get(nextUrl)
    setNextUrl(res.data.next)
    res.data.results.forEach(async(pokemon:Pokemons) => {
      const poke = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemon.name}`)
      setPokemons((p) => [...p,poke.data])
      setLoading(false)
    })
  }

  return (
    <div className="App">
      <div className="container">
        <header className='pokemon-header'>Pokemon</header>
        <PokemonColection pokemons={pokemons} viewDetail={viewDetail} setDetail={setDetail}/>
        {!viewDetail.isOpen && (
          <div className="btn">
          <button onClick={loadPokemon}>{loading ? "Loading..." : "Load more"}</button>
        </div>
        )}
        <p>Pham Quoc Thong</p>
      </div>
    </div>
  );
}

export default App;
