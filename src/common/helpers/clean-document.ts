export class CleanDocument {
  /*
    Limpa o documento removendo todos os caracteres não numéricos.
     */
  static clean(document: string): string {
    return document.replace(/\D/g, '');
  }
}
