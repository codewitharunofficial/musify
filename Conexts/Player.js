import { createContext, useState } from "react";

const Player = createContext();

const PlayerConext = ({children}) => {
    const [currentTrack, setCurrentTrack] = useState(null);

    return (
        <Player.Provider value={{currentTrack, setCurrentTrack}} >
            {children}
        </Player.Provider>
    )
}

export {Player, PlayerConext};