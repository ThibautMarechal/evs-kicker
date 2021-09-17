import { QueryClient } from 'react-query';
import { broadcastQueryClient } from 'react-query/broadcastQueryClient-experimental';

const queryClient = new QueryClient();

broadcastQueryClient({ queryClient, broadcastChannel: 'react-query' });

export { queryClient };
