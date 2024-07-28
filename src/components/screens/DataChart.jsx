import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

function DataChart({ urlId }) {
    const chartContainer = useRef(null);
    const chartInstance = useRef(null);

    // Define state variables
    const [dataLabel, setDataLabel] = useState([]);
    const [dataVal, setDataVal] = useState([]);

    const getData = async () => {
        try {
            let result = await fetch(import.meta.env.VITE_HANDEL_DATA_GRAPH, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: urlId })
            });

            if (result.ok) {
                const data = await result.json();
                // Clear previous data
                setDataLabel([]);
                setDataVal([]);
                // Update state using setter functions
                data.forEach(val => {
                    setDataLabel(prevData => [...prevData, new Date(val.date_only).toDateString().slice(4,10)]);
                    setDataVal(prevData => [...prevData, val.date_count]);
                });
                // Call showDataGraph after updating data
                showDataGraph();
            } else {
                console.error('Failed to fetch data:', result.statusText);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const showDataGraph = () => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (chartContainer.current) {
            const ctx = chartContainer.current.getContext('2d');
            chartInstance.current = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: dataLabel,
                    datasets: [{
                        label: 'Clicks',
                        data: dataVal,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)',
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 206, 86, 1)',
                        ],
                        borderWidth: 2
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });
        }
    };

    useEffect(() => {
        getData();
    }, []);

    useEffect(() => {
        // Call showDataGraph whenever dataLabel or dataVal changes
        showDataGraph();
    }, [dataLabel, dataVal]);

    return (
        <>
            <div className="flex flex-col w-full md:w-1/2 h-96 p-3 overflow-hidden overflow-y-scroll shadow-sm shadow-gray-300 border-gray-300 border-t-2 mt-2 md:mx-2 md:mt-0">
                <div className='h-full w-full object-contain'>
                    <canvas ref={chartContainer}></canvas>
                </div>
            </div>
        </>
    );
}

export default DataChart;
