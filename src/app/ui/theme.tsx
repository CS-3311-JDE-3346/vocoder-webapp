
import { useEffect, useState } from "react";

const Toggle = () => {
    const [isContrast, settoHighContrast] = useState(false);

    const toggleContrast = () => {
        settoHighContrast(prevMode => !prevMode);
        document.documentElement.classList.toggle('dark', isContrast);
    };

    useEffect(() => {
        const def_dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        const storedTheme = localStorage.getItem('theme');
        settoHighContrast(storedTheme === 'dark' || (storedTheme === null && def_dark));
        document.documentElement.classList.toggle('dark', storedTheme === 'dark' || (storedTheme === null && def_dark));
    }, [])

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