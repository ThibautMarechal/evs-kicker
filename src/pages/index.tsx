import { PlayerPreview } from '../components/PlayerPreview';
import { useGames } from '../react-query/games';

export default function Home() {
  const { data: games } = useGames();
  return (
    <>
      <form>
        <label>Player 1</label>
        <input type="string" name="player1" />
        <label>Player 2</label>
        <input type="string" name="player4" />
        <label>Player 3</label>
        <input type="string" name="player3" />
        <label>Player 4</label>
        <input type="string" name="player4" />
        <button>Submit</button>
      </form>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Date</th>
              <th>TeamA</th>
              <th>TeamB</th>
            </tr>
          </thead>
          <tbody>
            {games?.map((game) => (
              <tr key={game.id}>
                <td>{new Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(game.date))}</td>
                <td>
                  <div className="inline-flex space-x-3">
                    {game.teamA.map((player, i) => (
                      <PlayerPreview id={player} key={i} />
                    ))}
                  </div>
                </td>
                <td>
                  <div className="inline-flex space-x-3">
                    {game.teamB.map((player, i) => (
                      <PlayerPreview id={player} key={i} />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
