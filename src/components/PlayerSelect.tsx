import { usePlayers } from '../react-query/players';
import { Player } from '../typing';
import dynamic from 'next/dynamic';

const Select = dynamic(() => import("react-select"), { ssr: false });

type Props = {
  value?: Player[];
  onChange?: (value: Player[] | null) => void;
  filterOption?: (player: Player) => boolean;
  placeholder?: string;
};

export const PlayerSelect = ({ value, onChange, filterOption = () => true, placeholder = 'Players' }: Props) => {
  const { data: players } = usePlayers();
  const options = players?.filter(filterOption) ?? [];
  return (
    <Select
      value={value}
      onChange={(v) => onChange?.(v as Array<Player> ?? [])}
      options={options}
      getOptionValue={(o) => (o as Player).id}
      getOptionLabel={(o) => (o as Player).username}
      isMulti
      placeholder={placeholder}
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
  );
};

export default PlayerSelect;
