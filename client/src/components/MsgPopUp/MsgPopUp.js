import './MsgPopUp.css';

function MsgPopUp({message, buttonMsg, handleSubmit, handleClose}) {


    return (
        <div id="newUnitDiv">
            <div id="backgroundDiv"></div>
            <div id="forgroundDivPopUp">
                <h2 id='popUpMessage'>{message}</h2>
                <div>
                <button id="popUpButton" onClick={handleSubmit}>{buttonMsg}</button>
                <button onClick={handleClose}>Close</button>
                </div>
            </div>
        </div>
    )
}

export default MsgPopUp;