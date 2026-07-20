/**
 * @module lives.ts Управляет количеством жизней игрока
 *    @var lives Количество жизней
 *    @function setLives Изменяет количество жизней
 *    @function getLives Возвращает количество жизней
 */

/**
 * @var текущее количество жизней, сохраненное игроком при прохождении уровня
 */
let lives = 0;
/**
 * Устанавливает текущее количество жизней
 * @param live новые жизни, полученные(+), или потерянные(-) игроком при прохождении уровня
 */
export function setLives(live: number): void {
  setLivesCount(lives + live);
}
export function setLivesCount(live: number): void {
  lives = Math.max(0, live);
}
export function resetLives(): void {
  setLivesCount(0);
}
export function consumeLife(): number {
  setLives(-1);
  return lives;
}
export function hasNoLivesRemaining(): boolean {
  return lives === 0;
}
/**
 * Возвращает текущее количество жизней, доступных игроку при прохождении уровня
 * @returns lives
 */
export function getLives(): number {
  return lives;
}
