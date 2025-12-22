import { TinaAdmin } from 'tinacms'
import config from '../../tina/config'

export default function Admin() {
  return <TinaAdmin config={config} />
}
