import { useState } from "react";

function Rules() {
    const languages = {
        en: <><p>Players take turns in drawing lines between dots on a grid. The player who completes the most boxes wins.</p>
            <p>The two players take turns to join two adjacent dots with a horizontal or vertical line. If a player completes the fourth side of a box they get a point and must draw another line.</p>
            <p>When all the boxes have been completed the winner is the player who has more points.</p></>,
        pl: <><p>Gracze na zmianę rysują linie między kropkami na siatce. Gracz, który zajmie najwięcej kwadratów, wygrywa.</p>
            <p>Dwóch graczy na zmianę łączy dwie sąsiednie kropki linią poziomą lub pionową. Jeśli gracz wypełni czwartą stronę kwadratu, otrzymuje punkt i musi narysować kolejną linię.</p>
            <p> Gdy wszystkie pola zostaną wypełnione, zwycięzcą zostaje gracz, który ma więcej punktów.</p></>,
        ru: <><p>Игроки по очереди рисуют линии между точками на сетке. Побеждает игрок, занявший наибольшее количество квадратов.</p>
            <p>Два игрока по очереди соединяют две соседние точки горизонтальной или вертикальной линией. Если игрок завершает четвертую сторону квадрата, он получает балл и должен провести еще одну линию.</p>
            <p>Когда все квадраты будут заняты, победителем становится игрок, набравший найбольшее количество баллов.</p>
        </>
    }

    const [lang, setLang] = useState("en")

    return (
        <section className="content">
            <div className="languages">
                <ul>
                    <li onClick={() => { setLang("en") }} className={`${lang === "en" ? "active" : ""}`}>EN</li>
                    <li onClick={() => { setLang("pl") }} className={`${lang === "pl" ? "active" : ""}`}>PL</li>
                    <li onClick={() => { setLang("ru") }} className={`${lang === "ru" ? "active" : ""}`}>RU</li>
                </ul>
            </div>
            <div className="rules">
                <h1>Game rules</h1>
                {languages[lang]}
            </div>
        </section>
    )
}

export default Rules;