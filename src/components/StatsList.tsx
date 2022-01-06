import { ReactElement } from 'react'

import styles from './StatsList.module.css'

type Props = {
  children: ReactElement[]
  title?: string
  list?: boolean
}

export default function StatsList({ children, title, list }: Props) {
  const terms = children
    .reduce(getDefinitions, [])
    .filter((child) => child.type === 'dt')

  const definitions = children
    .reduce(getDefinitions, [])
    .filter((child) => child.type === 'dd')

  return (
    <>
      {title && <h2 className={styles.title}>{title}</h2>}
      <dl className={list ? styles.verticalList : styles.horizontalList}>
        {terms.map((term, index) => (
          <div className={styles.item} key={index}>
            <dt className={`${styles.term} ${list ? 'h4' : ''}`.trim()}>{term.props.children}</dt>
            <dd className={`${styles.definition} ${list ? '' : 'h1'}`.trim()}>{definitions[index].props.children}</dd>
          </div>
        ))}
      </dl>
    </>
  )
}

function getDefinitions(acc: ReactElement[], child: ReactElement): ReactElement[] {
  if (
    child.type !== 'dd' &&
    child.type !== 'dt' &&
    typeof child.props.children === 'object'
  ) {
    acc.push(...child.props.children)
  } else {
    acc.push(child)
  }
  return acc
}
