export const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    bgcolor: "background.paper",
    // border: "2px solid #000",
    borderRadius: "20px",
    boxShadow: 24,
    textAlign: "center",
    p: 4,
};


const difficults = {
    easy: "легко",
    middle: "средняя",
    hard: "сложно"
}

export function difficultFromKey(key) {
    return difficults[key.toLowerCase()];
}

export function difficultKeyFromValue(value) {
    for (let key in difficults) {
        if (difficults[key] === value) {
            return key;
        }
        return "";
    }
}