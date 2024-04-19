
import { useState } from "react";

const Toggle = () => {
    const [isContrast, settoHighContrast] = useState(false);

    const toggleContrast = () => {
        settoHighContrast(prevMode => !prevMode);
        document.documentElement.classList.toggle('dark', isContrast);
    };

    return  (
        <button
            className="float-left p-2 rounded-full bg-blue-700 text-slate-300 rounded-lg"
            onClick={toggleContrast}
        >
            Contrast
        </button>
    )
}

export default Toggle;