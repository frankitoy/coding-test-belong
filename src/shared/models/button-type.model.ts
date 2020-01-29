export default interface IButtonType {
  text: string;
  event: string;
  btnClass: string;
  clickHandler: (event: React.MouseEvent<HTMLElement>) => void;
}
