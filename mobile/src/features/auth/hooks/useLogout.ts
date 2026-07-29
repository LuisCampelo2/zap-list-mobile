import { useLogoutMutation } from '../../../services/api/authApi';
import { secureStorage } from '../../../services/storage/secureStorage';
import { clearCredentials } from '../../../store/slices/authSlice';
import { useAppDispatch } from '../../../store/hooks';

/**
 * Logout é "best effort" no servidor: mesmo que a chamada de revogação falhe
 * (sem rede, servidor fora do ar), o app limpa a sessão local imediatamente —
 * o usuário não pode ficar preso numa tela por causa de uma falha de rede.
 */
export function useLogout() {
  const [logoutMutation] = useLogoutMutation();
  const dispatch = useAppDispatch();

  return async () => {
    const refreshToken = await secureStorage.getRefreshToken();
    if (refreshToken) {
      await logoutMutation({ refreshToken }).catch(() => {});
    }
    await secureStorage.clearRefreshToken();
    dispatch(clearCredentials());
  };
}
