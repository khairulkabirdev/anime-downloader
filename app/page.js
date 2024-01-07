"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { ANIME } from "@consumet/extensions"



export default function Home() {
  const [nimesearch, setSearch] = useState(['loding...']);
  const [name, setName] = useState('');
// Search for an anime. In this case, "One Piece"
useEffect(() => {
  fetchData(name); // Call fetchData initially with the default value

  async function fetchData(animeName) {
    try {
      const gogoanime = new ANIME.Gogoanime();
      const data = await gogoanime.search(animeName);
      setSearch(data.results); // Set 'results' from fetched data to the state
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
}, [name]); // Run useEffect when 'name' state changes

const handleInputChange = (event) => {
  setName(event.target.value); // Update 'name' state on input change
};


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
    <div>
      <input
        className='flex w-full'
        name='anime_name'
        value={name}
        onChange={handleInputChange}
        placeholder="Enter anime name"
      />
    </div>

    <div className="grid grid-cols-2 gap-4">
      {nimesearch.map((item) => (
        <div key={item.id} className="flex items-center border p-4 rounded-lg">
          <img src={item.image} alt={item.title} className="w-24 h-24 rounded-md mr-4" />
          <div>
            <h3 className="font-semibold">{item.title}</h3>
            <p>{item.releaseDate}</p>
            <p>{item.subOrDub}</p>
          </div>
        </div>
      ))}
    </div>
  </main>
  )
}
