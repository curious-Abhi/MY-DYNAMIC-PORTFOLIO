import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel";

const Certificate = () => {
    const [certificates, setCertificates] = useState([]);

    useEffect(() => {
        const getMyCertificates = async () => {
            const { data } = await axios.get(
                "http://localhost:4000/api/v1/certificate/getall",
                { withCredentials: true }
            );
            //console.log(data);
            setCertificates(data.certificates);
        };
        getMyCertificates();
    }, []);

    return (
        <>
            <h1 className="text-tubeLight-effect text-[2rem] sm:text-[2.75rem] md:text-[3rem] lg:text-[3.8rem] tracking-[15px] dancing_text mx-auto w-fit">
                MY Certificates
            </h1>
            <Carousel className="my-8">
                <CarouselContent className="flex space-x-4">
                    {certificates.map((certificate) => (
                        <CarouselItem key={certificate.id} className="flex-shrink-0 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-4">
                            <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                                <img src={certificate.img_url} alt={certificate.name} className="w-full h-full object-cover" />
                                <div className="p-4">
                                <h2 className="text-xl font-bold mb-2 text-black">{certificate.name}</h2> 
                                <p className="text-gray-700">Organization:{certificate.organization_name}</p> 
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg" />
                <CarouselNext className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full shadow-lg" />
            </Carousel>
        </>
    );
}

export default Certificate;
