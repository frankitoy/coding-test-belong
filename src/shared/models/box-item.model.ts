export default interface IBoxItem {
  id: string;
  isActivated: boolean;
  x: number;
  y: number;
  boxItemOnClickHandler: (event: React.MouseEvent<HTMLElement>) => void;
}
