export function getRandomBgColorWithBorder() {
    const colors = [
        'bg-red-200 border-red-400',
        'bg-blue-200 border-blue-400',
        'bg-green-200 border-green-400',
        'bg-yellow-200 border-yellow-400',
        'bg-purple-200 border-purple-400',
        'bg-pink-200 border-pink-400',
        'bg-indigo-200 border-indigo-400',
        'bg-teal-200 border-teal-400',
        'bg-orange-200 border-orange-400',
        'bg-cyan-200 border-cyan-400',
        'bg-lime-200 border-lime-400',
    ];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
}