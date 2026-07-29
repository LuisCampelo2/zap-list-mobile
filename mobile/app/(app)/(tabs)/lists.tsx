import { ListChecks } from 'lucide-react-native';
import { EmptyState, Screen } from '../../../src/components/ui';

export default function ListsScreen() {
  return (
    <Screen>
      <EmptyState
        icon={ListChecks}
        title="Suas listas chegam em breve"
        description="A criação e o gerenciamento de listas de compras entram na próxima fase do app."
      />
    </Screen>
  );
}
