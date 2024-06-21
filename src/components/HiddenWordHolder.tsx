const FirsLetterHolder = (props: { firstletter: string }) => (
  <input
    className='word'
    disabled
    placeholder={props.firstletter}></input>
)

const RestOfTheWordHolder = (props: { restOfTheWord: string[] }) =>
  props.restOfTheWord.map((_letter, key) => (
    <input
      className='word'
      key={key}
      disabled
      placeholder={'.'}></input>
  ))

export const HiddenWordHolder = (props: { wordToFind: string }) => {
  const [firstletter, ...restOfTheWord] = props.wordToFind

  return (
    <div>
      {<FirsLetterHolder firstletter={firstletter} />}
      {<RestOfTheWordHolder restOfTheWord={restOfTheWord} />}
    </div>
  )
}
