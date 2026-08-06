import { Link, useParams } from "react-router-dom";
import { ErrorState } from "../../components/feedback/ErrorState";
import { collectionStore } from "../../admin/store/CollectionStore";
import { panelStore } from "../../admin/store/PanelStore";
import { KioskPlayer } from "../../renderer/KioskPlayer";
import { resolveCollectionSlides } from "../../renderer/resolveCollectionSlides";
import styles from "./KioskPresentationPage.module.css";

/** Rota sem o shell do app — o telão não precisa (nem deve) mostrar header/nav. */
export default function KioskPresentationPage() {
  const { id } = useParams<{ id: string }>();
  const collection = id ? collectionStore.get(id) : undefined;

  if (!id || !collection) {
    return (
      <div className={styles.page}>
        <ErrorState
          title="Coleção não encontrada"
          message={`Não existe uma coleção com o identificador "${id ?? ""}".`}
        >
          <Link to="/sala" className={styles.backLink}>
            Voltar para Apresentações
          </Link>
        </ErrorState>
      </div>
    );
  }

  const slides = resolveCollectionSlides(collection, (panelId) => panelStore.get(panelId));

  return (
    <div className={styles.page}>
      <Link to={`/sala/${collection.id}`} className={styles.exitLink}>
        ← Sair
      </Link>
      <div className={styles.stageWrap}>
        <KioskPlayer collection={collection} slides={slides} />
      </div>
    </div>
  );
}
