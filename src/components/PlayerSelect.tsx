import Gravatar from 'react-gravatar';
import { usePlayers } from '../react-query/players';
import { Player } from '../typing';
import dynamic from 'next/dynamic';
import { components } from 'react-select';
import { PlayerPreview } from './PlayerPreview';

const Select = dynamic(() => import("react-select"), { ssr: false });

type Props = {
  value?: Player[];
  onChange?: (value: Player[] | null) => void;
  filterOption?: (player: Player) => boolean;
  placeholder?: string;
  sortByEloDescending?: boolean
  maxSelection?: number
};



export const PlayerSelect = ({ value, onChange, filterOption = () => true, placeholder = 'Players', sortByEloDescending = true, maxSelection }: Props) => {
  const { data: players } = usePlayers({
    select: (players) => {
      if(sortByEloDescending){
        return players
      }
      return [...players].reverse();
    },
  });
  const options = players?.filter(filterOption) ?? [];
  return (
    <div>
      <Select
        value={value}
        onChange={(v) => {
          if(!Array.isArray(v)){
            return
          }
          if(maxSelection !== undefined && v.length > maxSelection){
            return
          }
          if(!v){
            onChange?.([])
          }
          onChange?.(v)
        }}
        options={options}
        getOptionValue={(o) => (o as Player).id}
        getOptionLabel={(o) => (o as Player).username}
        isMulti
        placeholder={placeholder}
        components={{
          Option: (props) => (
            <components.Option {...props}>
              <PlayerPreview id={(props.data as Player).id}/>
            </components.Option>
          ),
          MultiValue: (props) => (
            <components.MultiValue {...props}>
              <PlayerPreview id={(props.data as Player).id}/>
            </components.MultiValue>
          )
        }}
        styles={{
          menu: (provided) => ({
            ...provided,
            zIndex: 100,
            backgroundColor: 'oklch(var(--b2))',
          }),
          option: (provided, props) => ({
            ...provided,
            backgroundColor: props.isFocused ? 'oklch(var(--b3))' : 'oklch(var(--b2))',
            ':active': {
              backgroundColor: 'oklch(var(--b3))',
            },
          }),
          control: (provided) => ({
            ...provided,
            border: 0,
            backgroundColor: 'oklch(var(--b2))',
          }),
          multiValue: (provided) => ({
            ...provided,
            color: 'oklch(var(--tw-bg-opacity))',
            backgroundColor: 'oklch(var(--b3))',
          }),
          multiValueLabel: (provided) => ({
            ...provided,
            color: 'unset',
          }),
          multiValueRemove: (provided) => ({
            ...provided,
            ':hover': {
              backgroundColor: 'oklch(var(--er))',
            },
          }),
        }}
      />
    </div>
  );
};

export default PlayerSelect;
