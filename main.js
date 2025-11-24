/*DOMContentLoaded = se ejecuta cuando el HTML ya cargó.*/
document.addEventListener("DOMContentLoaded", () => {

    console.log("Calculadora iniciada correctamente");

    // --- 1. CAPTURAR ELEMENTOS DEL HTML --- //

    const exprEl = document.getElementById("expression");   // pantalla de expresión
    const resultEl = document.getElementById("result");     // pantalla de resultado
    const button = document.querySelectorAll(".btn");      // todos los botones
    const equalsBtn = document.getElementById("equals");    // botón "="
    const historyList = document.getElementById("historyList"); // lista <ul> historial
    const copyBtn = document.getElementById("copyBtn");     // botón copiar
    const clearHistoryBtn = document.getElementById("clearHistory"); // limpiar historial
    const themeToggle = document.getElementById("themeToggle"); // tema oscuro/claro

    console.log("Elementos cargados correctamente");

    //Evento click
    button.forEach(btn => {
        btn.addEventListener("click", () => {
            const value = btn.innerText;

            if (value === "C") {
                exprEl.innerText = "";
                resultEl.innerText = "0";
            } else if (value === "DEL") {
                exprEl.innerText = exprEl.innerText.slice(0, -1);
            } else if (value !== "=") {

                // Concatenar el valor del botón a la expresión
                exprEl.innerText += value;
            }
        });
    });

    // --- BOTÓN "=" (evaluar expresión) ---
    equalsBtn.addEventListener("click", () => {
        let expression = exprEl.innerText;

        if (!expression) return;

        // Convertir simbolos especiales
        expression = expression.
                    replace(/×/g, '*').
                    replace(/÷/g, '/');

        try {
            const result = eval(expression); // temporal, luego lo haremos más seguro
            resultEl.innerText = result;

            // Guardar en historial
            addToHistory(expression, result);

        } catch (error) {
            resultEl.innerText = "Error";
        }
    });

    // --- CAPTURAR NÚMEROS DEL TECLADO --- //
    window.addEventListener("keydown", (e) => {

        // Si se presiona un número del 0 al 9
        if (/^[0-9]$/.test(e.key)) {
            exprEl.innerText += e.key;
            return;
        }

        // Operadores básicos
        if (e.key === "+" || e.key === "-" || e.key === "*" || e.key === "/") {
            exprEl.innerText += e.key;
            return;
        }

        // Punto decimal
        if (e.key === ".") {
            exprEl.innerText += ".";
            return;
        }

        // Enter para calcular
        if (e.key === "Enter") {
            const expression = exprEl.innerText;

            if (!/^[0-9+\-*/().\s]+$/.test(expression)) {
                resultEl.innerText = "Error";
                return;
            }

            try {
                const resultado = eval(expression);
                resultEl.innerText = resultado;
            } catch {
                resultEl.innerText = "Error";
            }

            return;
        }

        // Backspace para borrar
        if (e.key === "Backspace") {
            exprEl.innerText = exprEl.innerText.slice(0, -1);
            return;
        }

        // DELETE para borrar todo
        if (e.key === "Delete") {
            exprEl.innerText = "";
            resultEl.innerText = "0";
            return;
        }
    });

    // --- BOTÓN COPIAR RESULTADO ---
    copyBtn.addEventListener("click", () => {
        const result = resultEl.innerText;
        navigator.clipboard.writeText(result).then(() => {
            console.log("Resultado copiado al portapapeles:", result);
        }).catch(err => {
            console.error("Error al copiar al portapapeles:", err);
        });
    });

    // --- BOTÓN LIMPIAR HISTORIAL ---
    clearHistoryBtn.addEventListener("click", () => {
        // Confirmación opcional
        const confirmDelete = confirm("¿Deseas borrar todo el historial?");
        if (!confirmDelete) return;
        
        // 1. Vaciar visualmente la lista
        historyList.innerHTML = "";

        // 2. Borrar del localStorage
        localStorage.removeItem("calc_history");
    });

    // --- BOTÓN CAMBIAR TEMA OSCURO/CLARO ---
    const themeId = document.getElementById("themeToggle");

    // --- Cargar tema guardado ---
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        themeId.textContent = "☀️"; // icono modo oscuro activo
    } else if (savedTheme === "light") {
        document.body.classList.remove("dark");
        themeId.textContent = "🌙"; // icono modo claro activo
    } else {
        // si no hay nada, detecta según el sistema:
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            document.body.classList.add("dark");
            themeId.textContent = "☀️";
        } else {
            document.body.classList.remove("dark");
            themeId.textContent = "🌙";
        }
    }

    // --- Evento al presionar el botón ---
    themeToggle.addEventListener("click", () => {

        const isDark = document.body.classList.toggle("dark");

        if (isDark) {
            themeId.textContent = "☀️";
            localStorage.setItem("theme", "dark");
        } else {
            themeId.textContent = "🌙";
            localStorage.setItem("theme", "light");
        }
    });

});

function addToHistory(expression, result) {
    const li = document.createElement("li");
    li.textContent = `${expression} = ${result}`;
    historyList.appendChild(li);
}


