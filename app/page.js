"use client"
import Image from 'next/image'
import { useState, useEffect } from 'react';
import {Progress,Textarea,Input,Button,Select, SelectSection , SelectItem} from "@nextui-org/react";
import { ANIME } from "@anime-search/extension-of-anime"

import { StreamingServers } from '@anime-search/extension-of-anime/dist/models';



export default function Home() {
  const [progressValue, setProgressValue] = useState(0);
  const [anime, setAnime] = useState();
  const [nimesearch, setSearch] = useState([]);
  const [name, setName] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const [selectedQualaty, setSelectedQualaty] = useState('');
  const [startEp, setStartEp] = useState('');
  const [endEp, setEndEp] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [ epLink, setEpLink] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const [copied, setCopied] = useState(false);



useEffect(() => {
  fetchData(name); 

  async function fetchData(name) {
    if (name!="" ){
      try {
        const gogoanime = new ANIME.Gogoanime();
        const data = await gogoanime.search(name);
        setSearch(data.results); // Set 'results' from fetched data to the state
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    
  }
}, [name]); // Run useEffect when 'name' state changes

const handleInputChange = (event) => {
  setName(event.target.value); // Update 'name' state on input change
  setAnime(event.target.value); // Update 'name' state on input change
};

const handleOptionClick = (id) => {
  setAnime(id);
  setSearch([]);
};


  const animals = [
    { value: 'gogocdn', label: 'Gogo Cdn' },
    { value: 'streamsb', label: 'Stream Sb' },
    { value: 'vidstreaming', label: 'Vid Streaming' },
    // Add more animals as needed
  ];

  const handleAnimalChange = (selectedValue) => {
    setSelectedAnimal(selectedValue);
  };


  const qulitys = [
    { value: '360p', label: '360' },
    { value: '480p', label: '480' },
    { value: '720p', label: '720' },
    { value: '1080p', label: '1080' },
    // Add more animals as needed
  ];

  const handleQulitysChange = (selectedValue) => {
    setSelectedQualaty(selectedValue);
  };






 
  const handleGetLinks = async () => {
    if (!anime) {
      setErrorMessage('Please fill in the anime name');
      return;
    }
  
    if (!startEp || !endEp) {
      setErrorMessage('Please fill in both start and end episode numbers');
      return;
    }
  
    if (!selectedAnimal) {
      setErrorMessage('Please select a server');
      return;
    }
  
    if (!selectedQualaty) {
      setErrorMessage('Please select a quality');
      return;
    }
    setEpLink('');
  
    setErrorMessage('');
    setIsLoading(true);
    try {

      let newEpLinks = ''; // Variable to store new links
      let totalEpisodes = endEp - startEp + 1; // Calculate total number of episodes
      let linksFetched = 0;

      // Loop through each episode from startEp to endEp
      for (let episodeNumber = startEp; episodeNumber <= endEp; episodeNumber++) {
        const episodeID = `${anime}-episode-${episodeNumber}`;
       
        const url = '/api/getlinks';
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: episodeID, server: selectedAnimal }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch links');
        }
  
        const responseData = await response.json();
        console.log('Response Data:', responseData);
  
        // Filter sources based on selected quality
        const filteredSources = responseData.sources.filter(source => source.quality === selectedQualaty);
  
        if (filteredSources.length > 0) {
          // Get the URL of the first matching quality
          const selectedQualityUrl = filteredSources[0].url;
          newEpLinks += selectedQualityUrl + '\n';
          setEpLink(prevLinks => prevLinks + selectedQualityUrl + '\n');
          console.log('Selected Quality URL:', selectedQualityUrl);
          linksFetched++; // Increment counter for links fetched
          setProgressValue((linksFetched / totalEpisodes) * 100); 
          // You can further process the URL as per your requirements
        } else {
          console.error('Selected quality not found in the response');
        }
      }
      setIsLoading(false);
    } catch (error) {
      console.error('Error making POST request:', error.message);
      setIsLoading(false); 
    }
  };


  const handleCopy = () => {
    navigator.clipboard.writeText(epLink)
      .then(() => {
        setCopied(true); // Set copied state to true
        setTimeout(() => {
          setCopied(false); // Reset copied state after 3 seconds
        }, 3000);
      })
      .catch(error => {
        console.error('Failed to copy text: ', error);
      });
  };
  

  return (
    <main className=" flex flex-col  min-h-screen items-center justify-center mx-auto">    
    {errorMessage && <p>{errorMessage}</p>}  
    <div className="flex flex-col gap-2 justify-center mx-auto  ">
      <div className="flex  flex-col items-center justify-center p-2  mx-auto  w-full ">
          <Input
            className='w-80 flex items-center justify-end flex-row-reverse'
            name='anime_name'
            value={anime}
            required
            onChange={handleInputChange}
            placeholder="Enter anime name"
            endContent={
              <Button className=" m-0 p-0 flex-none" isIconOnly onClick={()=>setAnime('')} color="primary">
                <svg aria-hidden="true" focusable="false" height="1.8em" role="presentation" viewBox="0 0 24 24" width="1.8em"><path d="M12 2a10 10 0 1010 10A10.016 10.016 0 0012 2zm3.36 12.3a.754.754 0 010 1.06.748.748 0 01-1.06 0l-2.3-2.3-2.3 2.3a.748.748 0 01-1.06 0 .754.754 0 010-1.06l2.3-2.3-2.3-2.3A.75.75 0 019.7 8.64l2.3 2.3 2.3-2.3a.75.75 0 011.06 1.06l-2.3 2.3z" fill="currentColor"></path></svg>
              </Button>
            }
          />
         {nimesearch.length > 0 && (
            <div className='overflow-y-auto w-80 max-h-80 flex flex-col  justify-start min-w-full p-4 mx-auto'>
              {nimesearch.map((item) => (
                <div key={item.id} onClick={() => handleOptionClick(item.id)} className="flex items-center m-3 p-2 rounded-lg">
                  <img src={item.image} alt={item.title} className="w-10 h-10 rounded-full mr-4" />
                  <div>
                    <h6 className="font-bold">{item.title}</h6>
                    <p>{item.releaseDate}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      <div className="flex  flex-col items-center justify-center p-2  w-full  ">
          <Input
            className='w-full flex items-center justify-end flex-row-reverse'
            name='anime_name'
            type='number'
            required
            value={startEp} // Add this to bind the value to the state
            onChange={(event) => setStartEp(event.target.value)}
            placeholder="ep start number"
            
          />
      </div>

      <div className="flex  flex-col items-center justify-center p-2  w-full  ">
          <Input
            className='w-unit-80 max-w-xs flex items-center justify-end flex-row-reverse'
            name='anime_name'
            type='number'
            required
            placeholder="ep end number"
            value={endEp} // Add this to bind the value to the state
            onChange={(event) => setEndEp(event.target.value)}
          />
      </div>

      <div className="flex  flex-col items-center justify-center p-2  w-full  ">
      <Select
        items={animals}
        label="Servers"
        placeholder="Select an server"
        className="max-w-xs bg-slate-600"
        required
        value={selectedAnimal}

        onChange={handleAnimalChange}
      >
        {(animal) => <SelectItem  className=" bg-slate-600" onClick={()=>setSelectedAnimal(animal.value)}  key={animal.value}>{animal.label}</SelectItem>}
      </Select>
      </div>

      <div className="flex flex-col items-center justify-center p-2 w-full">
        <Select
          items={qulitys}
          label="qulitys"
          required
          placeholder="Select a qulity"
          className="max-w-xs bg-slate-600"
          value={selectedQualaty}
          onChange={handleQulitysChange}
        >
          {(qulity) => <SelectItem className="bg-slate-600" onClick={()=>setSelectedQualaty(qulity.value)} key={qulity.value}>{qulity.label}</SelectItem>}
        </Select>
      </div>
     
    </div>

    <div className="flex-col gap-4">
    <Button color="primary" onClick={handleGetLinks} variant="bordered">
        get links
      </Button>  
    </div>

    <div className='flex  flex-col items-center justify-center  w-full'>
    { isLoading && 

     <Progress
      aria-label="Downloading..."
      size="lg"
      value={progressValue}
      color="success"
      showValueLabel={true}
      className="max-w-lg w-full"
      />

    }   
    
    </div>

    <div  className='flex flex-col w-80 '>
        <Textarea
          label="links"
          variant="bordered"
          labelPlacement="outside"
          placeholder="Enter your description"
          className="max-w-xs "
          defaultValue=''
          value={epLink}
         
        />
        <div className='flex justify-items-center justify-end pt-4'>
        <Button color="primary" className='w-50' variant="bordered" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy links'}
        </Button>
        </div>
        
        

    </div>
  </main>
  )
}
