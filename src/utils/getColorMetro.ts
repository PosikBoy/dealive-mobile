export const getMetroColor = (line: string) => {
  switch (line) {
    case "Таганско-Краснопресненская":
      return "#8A4298"; // Цвет для Таганско-Краснопресненской линии
    case "Кольцевая":
      return "#905C4E"; // Цвет для Кольцевой линии
    // Добавьте другие случаи для других линий
    case "Замоскворецкая":
      return "#49B663";
    case "Люблинско-Дмитровская":
      return "#AEC84B";
    case "Некрасовская":
      return "#F294B5";
    case "Большая кольцевая линия":
      return "#80C8C5";
    case "Сокольническая":
      return "#F53342";
    case "Калужско-Рижская":
      return "#FC8A31";
    case "Серпуховско-Тимирязевская":
      return "#9F9F9F";
    case "Арбатско-Покровская":
      return "#0672B2";
    case "Филёвская":
      return "#08D2FF";
    case "МЦК":
      return "#D6171B";
    case "Калининская":
      return "#F3E022";
    case "Солнцевская":
      return "#F3E022";
    case "Бутовская":
      return "#B1CBEE";
    case "Курско-Рижский":
      return "#E74182";
    case "Белорусско-Савеловский":
      return "#ED9F2D";
    case "Калужско-Нижегородский":
      return "#3CB183";
    default:
      return "#000000"; // Цвет по умолчанию
  }
};
