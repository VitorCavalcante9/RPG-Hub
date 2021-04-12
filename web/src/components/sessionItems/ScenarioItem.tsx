import React, { HTMLAttributes, useContext, useEffect, useState } from 'react';
import { SessionContext } from '../../contexts/SessionContext';

import styles from '../../styles/components/sessionItems/ScenarioItem.module.css';

interface Scenario{
  id: string;
  name: string;
  image?: string;
}

interface ScenarioItemProps extends HTMLAttributes<HTMLDivElement>{
  scenario: Scenario;
}

export function ScenarioItem({scenario}: ScenarioItemProps){
  const {toggleFixScenario, fixedScenario} = useContext(SessionContext);

  const [textButton, setTextButton] = useState('Fixar');

  useEffect(() => {
    if(fixedScenario === scenario) setTextButton('Desafixar');
  }, [])

  useEffect(() => {
    if(fixedScenario !== scenario) setTextButton('Fixar');
  }, [fixedScenario])

  function toggleTextButton(){
    if(textButton == 'Fixar'){
      setTextButton('Desafixar');
      toggleFixScenario(scenario)
    }
    else{
      setTextButton('Fixar');
      toggleFixScenario(null)
    }
  }

  return(
    <div className={styles.scenarioContainer}>
      <div className={styles.image}>
        <img src={scenario.image} alt={scenario.name}/>
      </div>

      <div className={styles.name}>
        <p>{scenario.name}</p>

        <button onClick={toggleTextButton} type='button'>{textButton}</button>
      </div>
    </div>
  );
}