import React, { useEffect, useState } from 'react';
import Button from './shared/components/Button';
import IBoxItem from './shared/models/box-item.model';

import './App.scss';
import BoxItem from './shared/components/BoxItem';

const PANE_WIDTH = 20;
const PANE_HEIGHT = 20;
const GENERATION_VELOCITY = 100;

const App = () => {

  const [boxItemArray, setBoxItemArray] = useState();
  const [simulationStatus, setSimulationStatus] = useState(false);
  const [inNextGeneration, setInNextGeneration] = useState(false);
  const [generationCounter, setGenerationCounter] = useState(0);

  useEffect(() => {
    let timeout: any;
    if (generationCounter !== 0) {
      timeout = setTimeout(() => {
        if (inNextGeneration) {
          startNextGeneration();
        }
      }, GENERATION_VELOCITY);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [generationCounter]);

  // If reset is clicked
  useEffect(() => {
    renderInitialBoxItems();
  }, [simulationStatus]);

  const renderInitialBoxItems = () => {
    const initialCellArray = [];
    for (let i = 0; i < PANE_WIDTH; i++) {
      for (let j = 0; j < PANE_HEIGHT; j++) {
        initialCellArray.push({ id: `cell-x.${j}.y${i}`, isActivated: false, x: j, y: i });
      }
    }
    setBoxItemArray(initialCellArray);
  };
  const boxItemOnClickHandler = (event: React.MouseEvent<HTMLElement>) => {
    const id = String((event.target as HTMLInputElement).id);
    updateBoxItem(id, 'activated');
  };

  const startNextGeneration = (): void => {
    const newArray = [];
    for (let i = 0; i < boxItemArray.length; i++) {
      const newCell = { ...boxItemArray[i] };
      newArray.push(mutateBoxItem(newCell));
    }
    setGenerationCounter(generationCounter + 1);
    setBoxItemArray(newArray);
  };

  const startNextGenerationHandler = (): any => {
    setInNextGeneration(true);
    startNextGeneration();
  };

  const resetButtonOnClickHandler = () => {
    setInNextGeneration(false);
    setSimulationStatus(!simulationStatus);
  };

  const updateBoxItem = (id: string, type: string) => {
    const updatedCellArray = [];
    for (let i = 0; i < boxItemArray.length; i++) {
      const newCell = { ...boxItemArray[i] };
      if (type === 'activated') {
        if (newCell.id === id) {
          newCell.isActivated = !newCell.isActivated;
        }
      }
      updatedCellArray.push(newCell);
    }
    if (inNextGeneration) {
      setGenerationCounter(0);
      setBoxItemArray(updatedCellArray);
      setGenerationCounter(generationCounter + 1);
    } else {
      setBoxItemArray(updatedCellArray);
    }
  };

  const mutateBoxItem = (boxItem: IBoxItem) => {
    const newBoxItem = { ...boxItem };
    if (boxItem.isActivated) {
      if (countNeighbours(boxItem.x, boxItem.y, boxItem.id) < 2) {
        newBoxItem.isActivated = false;
      }
      if (countNeighbours(boxItem.x, boxItem.y, boxItem.id) === 2 || countNeighbours(boxItem.x, boxItem.y, boxItem.id) === 3) {
        newBoxItem.isActivated = true;
      }
      if (countNeighbours(boxItem.x, boxItem.y, boxItem.id) > 3) {
        newBoxItem.isActivated = false;
      }
    } else {
      if (countNeighbours(boxItem.x, boxItem.y, boxItem.id) === 3) {
        newBoxItem.isActivated = true;
      }
    }
    return newBoxItem;
  };

  const countNeighbours = (x: number, y: number, id: string) => {
    let neighbours = 0;
    const coordinateDiff = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];

    if (boxItemArray && boxItemArray.find((cell: IBoxItem) => cell.id === id)) {
      coordinateDiff.map(coordinate => {
        const neighborX = x + coordinate[0] > 0 ? x + coordinate[0] : x + coordinate[0] + PANE_WIDTH;
        const neighborY = y + coordinate[1] > 0 ? y + coordinate[1] : y + coordinate[1] + PANE_HEIGHT;
        const neighborId = `cell-x.${neighborX}.y${neighborY}`;
        const neighborDOM = boxItemArray.find((cell: IBoxItem) => cell.id === neighborId);
        if (neighborDOM && neighborDOM.isActivated) {
          neighbours++;
        }
      });
    }
    return neighbours;
  };

  return (
    <div className="App">
      <section className="container">
        {boxItemArray &&
        boxItemArray.map((boxItem: IBoxItem, index: number) => {
          return (
            <BoxItem
              key={index}
              id={boxItem.id}
              isActivated={boxItem.isActivated}
              x={boxItem.x}
              y={boxItem.y}
              boxItemOnClickHandler={boxItemOnClickHandler}
            />
          );
        })}
      </section>
      <div className="controls">
        {!inNextGeneration ? (
          <Button text="Start" event="generation" btnClass="btn red" clickHandler={startNextGenerationHandler} />
        ) : (
          <Button text="Evolving..." event="generating" btnClass="btn blue" clickHandler={() => {}} />
        )}
        <Button text="Pause/Reset" event="reset" btnClass="btn" clickHandler={resetButtonOnClickHandler} />
      </div>
    </div>
  );
};

export default App;
