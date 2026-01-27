import React from 'react';

export const SceneLayerSimple = () => {
    return (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-900 to-purple-900 z-0">
            <div className="flex items-center justify-center h-full">
                <div className="text-white text-center">
                    <h1 className="text-4xl font-bold mb-4">Automotive Experience</h1>
                    <p className="text-xl">Toyota Prius Prime 2024</p>
                    <p className="text-lg mt-2">Scene Layer Working</p>
                </div>
            </div>
        </div>
    );
};
