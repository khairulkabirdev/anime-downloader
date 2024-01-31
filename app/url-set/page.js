// app/url-set/page.js
"use client"
import { useState } from 'react';
import {Input,Button} from "@nextui-org/react";
export default function Home() {
    const [urls, setUrl] = useState();

    const handleInputChange = (event) => {
        setUrl(event.target.value);
    };


    const handleGetLinks = async () => {

        try {
            const url = '/api/url-change';
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ url: urls,}),
              });
            
    
              if (!response.ok) {
                throw new Error('Failed to fetch links');
              }
              console.log('Response Data:', response);
        } catch (error) {
            console.error('Error setting base URL:', error);
        }
        

      };


    return (
        <main className=" flex flex-col  min-h-screen items-center justify-center mx-auto">    
        <div className="flex flex-col gap-2 justify-center mx-auto  ">
            <div className="flex  flex-col items-center justify-center p-2  mx-auto  w-full ">
                <Input
                    className='w-80 flex items-center justify-end flex-row-reverse'
                    name='anime_name'
                    value={urls}
                    required
                    placeholder="Enter anime name"
                    onChange={handleInputChange}
                    autoComplete="off"
                />
            </div>
        </div>
    
        <div className="flex-col gap-4">
        <Button color="primary" onClick={handleGetLinks} variant="bordered">
           change gogoanime url
          </Button>  
        </div>

    
      </main>
      )
}