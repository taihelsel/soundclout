import React from 'react';

const SongHistory = ({ history, handleHistoryClick }) => {
    return (
        <ul className="song-history">
            <h1 className="song-history-head">Recently Viewed Songs</h1>
            {JSON.parse(localStorage.getItem("songHistory")).map(item =>
                <li onClick={handleHistoryClick(history, item.url)}>
                    <h1>
                        {item.title}
                    </h1>
                </li>
            )}
        </ul>
    )
}
export default SongHistory;