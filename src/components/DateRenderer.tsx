import * as React from 'react';

type Props = {
  value: string
};

export const DateRenderer = ({ value }: Props) => {
  return Intl.DateTimeFormat([], { dateStyle: 'medium' }).format(new Date(value));
}

export default DateRenderer;
