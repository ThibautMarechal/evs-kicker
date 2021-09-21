import { ComponentProps } from 'react';
import Select from 'react-select';
import { usePlayers } from '../react-query/players';
import { Player } from '../typing';

const selectStyle: ComponentProps<typeof Select>['styles'] = {
  menu: (provided) => ({
    ...provided,
    zIndex: 100,
    backgroundColor: 'hsla(var(--b2))',
  }),
  option: (provided, props) => ({
    ...provided,
    backgroundColor: props.isFocused ? 'hsla(var(--b3))' : 'hsla(var(--b2))',
    ':active': {
      backgroundColor: 'hsla(var(--b3))',
    },
  }),
  control: (provided) => ({
    ...provided,
    border: 0,
    backgroundColor: 'hsla(var(--b2))',
  }),
  multiValue: (provided) => ({
    ...provided,
    color: 'var(--tw-bg-opacity,1)',
    backgroundColor: 'hsla(var(--b3))',
  }),
  multiValueLabel: (provided) => ({
    ...provided,
    color: 'unset',
  }),
  multiValueRemove: (provided) => ({
    ...provided,
    ':hover': {
      backgroundColor: 'hsla(var(--er))',
    },
  }),
};

type Props = {
  value?: Player[];
  onChange?: (value: Player[] | null) => void;
  filterOption?: (player: Player) => boolean;
  placeholder?: string;
};

export const PlayerSelect = ({ value, onChange, filterOption = () => true, placeholder = 'Players' }: Props) => {
  const { data: players } = usePlayers();
  return (
    <Select
      value={value}
      // @ts-ignore
      onChange={onChange}
      options={players?.filter(filterOption)}
      getOptionValue={(o) => o.id}
      getOptionLabel={(o) => o.username}
      isMulti
      placeholder={placeholder}
      styles={selectStyle}
    />
  );
};

export default PlayerSelect;
