import { useState, useEffect, useRef } from 'react'
import './App.css'

type LetterState = 'false' | 'badPlace' | 'good'

type WordDoneType = { c: string; state: LetterState }

export const Wordle = () => {
  const cutWord = (wordToFind: string) => [...wordToFind]

  const [wordToFind, setWordToFind] = useState<string>('')

  const [wordToFindList, setWordToFindList] = useState<string[]>([])

  const [wordsDones, setWordsDones] = useState<WordDoneType[][]>([])

  const [currentWord, setCurrentWord] = useState<string[]>([])

  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(cutWord(wordToFind).length).fill(null))

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    setWord()
  }, [])

  function setWord() {
    const randomWordSize = Math.floor(Math.random() * 10)
    fetch(`https://trouve-mot.fr/api/size/${randomWordSize}`)
      .then(response => response.json())
      .then(data => {
        const word: string = data[0].name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')

        setWordToFind(word)
        console.log('DEV => word : ', word)
      })
      .catch(error => console.error('Error fetching the random word:', error))
  }

  useEffect(() => {
    if (wordToFind) {
      const value = cutWord(wordToFind)
      setWordToFindList(value)
      setCurrentWord([value[0]])
    }
  }, [wordToFind])

  const submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e?.preventDefault()

    const newWordDone: WordDoneType[] = []

    let charTofind = [...wordToFindList]

    let isSuccess = true

    wordToFindList.map((c, i) => {
      if (c == currentWord[i]) {
        newWordDone[i] = { c: currentWord[i], state: 'good' }

        charTofind = wordToFindList.filter((c, i2) => i2 != i && c)
      } else {
        isSuccess = false
        newWordDone[i] = { c: currentWord[i], state: 'false' }
      }
    })
    if (isSuccess) {
      setIsModalOpen(true)
    } else {
      wordToFindList.map((_c, i) => {
        if (newWordDone[i]?.state != 'good' && charTofind.includes(currentWord[i])) {
          newWordDone[i] = { c: currentWord[i], state: 'badPlace' }
        }
      })
      setCurrentWord(currentWord.fill('', 1))
      inputRefs.current[1]?.focus()
    }

    const newWordsDones = [...wordsDones]

    newWordsDones.push(newWordDone)

    setWordsDones(newWordsDones)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const newCurrentWord = [...currentWord]
    newCurrentWord[i] = event.target.value
    setCurrentWord(newCurrentWord)

    if (event.target.value.length === 1 && i < wordToFindList.length - 1 && inputRefs.current[i + 1])
      inputRefs.current[i + 1]?.focus()
  }

  const reset = () => {
    setWordsDones([])
    setCurrentWord(currentWord.fill('', 1))
    inputRefs.current[1]?.focus()
    setWord()
  }

  return (
    <>
      <div>
        <h1>TUSMO</h1>
        <div>
          {wordsDones.map((w, k) => (
            <div
              key={k}
              style={{ display: 'flex', alignContent: 'center' }}>
              {w.map((c, k2) => (
                <input
                  className='word'
                  style={{
                    backgroundColor:
                      c.state == 'good' ? 'green' : c.state == 'badPlace' ? 'yellow' : 'transparent',
                  }}
                  disabled
                  key={k2}
                  value={c.c}
                />
              ))}
            </div>
          ))}
        </div>
        <form
          id='newWord'
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {wordToFindList?.map((c, i) => (
              <input
                className='word'
                placeholder='.'
                value={i === 0 ? c : currentWord[i]}
                onChange={event => handleInputChange(event, i)}
                ref={el => (inputRefs.current[i] = el)}
                key={i}
                type='text'
                name={`word${i}`}
                maxLength={1}
                minLength={1}
                disabled={i === 0}
                required
              />
            ))}
          </div>

          <button onClick={e => submit(e)}>valider</button>
        </form>
        {isModalOpen && (
          <div className='popup'>
            <div className='popup-content'>
              <h2>Vous avez gagnez !!</h2>
              <p>le mot était : {wordToFind}</p>
              <button
                onClick={() => {
                  setIsModalOpen(false)
                }}>
                Fermer
              </button>
              <button
                style={{ backgroundColor: 'aqua', marginLeft: 10 }}
                onClick={() => {
                  setIsModalOpen(false)
                  reset()
                }}>
                Nouvelle Partie
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
