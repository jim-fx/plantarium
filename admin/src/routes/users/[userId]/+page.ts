import type { User } from '@plantarium/backend';
import { get } from '@plantarium/client-api';


export async function load({ params }) {
  const userResponse = await get<User>('api/user/' + params.userId);

  if (userResponse.ok) {
    return {
      user: userResponse.data,
      userId: params.userId,
    };
  }
}
