
        document.addEventListener('DOMContentLoaded', () => {
            
            const runButtons = document.querySelectorAll('.run-btn');
            
            // Статические ответы для простых блоков
            const staticOutputs = {
                '#out-vars': `Товар: Игровой Монитор
Цена в рублях: 37000.0
Есть в наличии? True
Тип данных rate: <class 'float'>`,
                
                '#out-lists': `Вначале: ['Яблоко', 'Банан', 'Вишня']
Теперь: ['Яблоко', 'ГРУША', 'Вишня', 'Апельсин']
Всего фруктов: 4`,

                '#out-slice': `Первые 4 буквы: Прог
С 5-й буквы: раммирование
Наоборот: еинавориммаргорП`
            };

            runButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const container = button.closest('.code-container');
                    const outputTargetSelector = container.dataset.outputTarget;
                    const outputConsole = document.querySelector(outputTargetSelector);
                    const interactiveId = container.dataset.interactiveId;

                    outputConsole.textContent = '>>> Выполнение кода...';

                    setTimeout(() => {
                        // 1. Логика Скидок
                        if (interactiveId === 'discount-calc') {
                            const amount = parseFloat(document.getElementById('order-sum').value);
                            const hasCard = document.getElementById('loyalty-card').value;
                            let discount = 0;
                            let reason = "";

                            if (isNaN(amount)) {
                                outputConsole.textContent = "Ошибка: введите число!";
                                return;
                            }

                            if (amount > 5000 || hasCard === "yes") {
                                discount = 0.10;
                                reason = "Скидка применена! (Условие выполнено)";
                            } else {
                                discount = 0;
                                reason = "Нет оснований для скидки";
                            }

                            const final = amount * (1 - discount);
                            outputConsole.textContent = `${reason}\nК оплате: ${final.toFixed(2)} руб.`;
                        }
                        
                        // 2. Функции (Конвертер)
                        else if (interactiveId === 'currency-func') {
                            const rub = parseFloat(document.getElementById('func-amount').value);
                            const cur = document.getElementById('func-currency').value;
                            let rate = 1;

                            if(isNaN(rub)) {
                                outputConsole.textContent = "Ошибка: введите рубли!";
                                return;
                            }

                            if (cur === "USD") rate = 92.5;
                            else if (cur === "EUR") rate = 101.2;
                            else if (cur === "CNY") rate = 12.8;

                            const res = (rub / rate).toFixed(2);
                            outputConsole.textContent = `Вызов функции convert_currency(${rub}, "${cur}")...\nРезультат обмена: ${res} ${cur}`;
                        }

                        // 3. PRO: Индексы и Визуализация
                        else if (interactiveId === 'neighbor-sum') {
                            const rawInput = document.getElementById('array-input').value;
                            const data = rawInput.split(',').map(item => parseFloat(item.trim())).filter(item => !isNaN(item));
                            const vizContainer = document.getElementById('viz-array');
                            
                            if (data.length < 2) {
                                outputConsole.textContent = "Ошибка: Введите минимум 2 числа!";
                                vizContainer.innerHTML = '<div class="text-red-500 p-2">Слишком мало данных для пар!</div>';
                                return;
                            }

                            // Генерация визуальных блоков
                            let htmlBlocks = '';
                            data.forEach((val, idx) => {
                                htmlBlocks += `<div class="array-cell" id="cell-${idx}"><span class="cell-val">${val}</span><span class="cell-idx">${idx}</span></div>`;
                            });
                            // Добавляем "призрачный" блок для иллюстрации ошибки
                            htmlBlocks += `<div class="array-cell opacity-30 border-dashed" id="cell-${data.length}"><span class="cell-val">VOID</span><span class="cell-idx">${data.length}</span></div>`;
                            vizContainer.innerHTML = htmlBlocks;

                            let consoleOutput = `Список длины ${data.length}. Индексы от 0 до ${data.length-1}.\n`;
                            consoleOutput += `Цикл range(len - 1) идет до индекса ${data.length-2}.\n----------------\n`;

                            // Анимация прохода
                            let i = 0;
                            const interval = setInterval(() => {
                                if (i >= data.length - 1) {
                                    clearInterval(interval);
                                    consoleOutput += "----------------\nУспех! Цикл остановлен вовремя.";
                                    outputConsole.textContent = consoleOutput;
                                    
                                    // Сброс стилей
                                    document.querySelectorAll('.array-cell').forEach(c => {
                                        c.classList.remove('highlight-current', 'highlight-next');
                                    });
                                    return;
                                }

                                // Очистка старых подсветок
                                document.querySelectorAll('.array-cell').forEach(c => {
                                    c.classList.remove('highlight-current', 'highlight-next');
                                });

                                // Подсветка текущих
                                const cellCurr = document.getElementById(`cell-${i}`);
                                const cellNext = document.getElementById(`cell-${i+1}`);
                                
                                if(cellCurr) cellCurr.classList.add('highlight-current');
                                if(cellNext) cellNext.classList.add('highlight-next');

                                const sum = data[i] + data[i+1];
                                consoleOutput += `i=${i}: ${data[i]} + ${data[i+1]} (сосед) = ${sum}\n`;
                                outputConsole.textContent = consoleOutput;
                                outputConsole.scrollTop = outputConsole.scrollHeight;

                                i++;
                            }, 800); // Задержка между шагами
                        }

                        // 4. Статика
                        else if (staticOutputs[outputTargetSelector]) {
                            outputConsole.textContent = staticOutputs[outputTargetSelector];
                        }
                    }, 200);
                });
            });

            // Навигация
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const id = entry.target.getAttribute('id');
                        document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));
                        const activeLink = document.querySelector(`.nav-link[href="#${id}"]`);
                        if(activeLink) activeLink.classList.add('active');
                    }
                });
            }, { threshold: 0.2 });

            document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
        });