import * as core from '@actions/core'
import AWS from 'aws-sdk'

import {addIP, removeIP} from './utils/wafv2'
import {getPublicIp} from './utils/ipify'

export async function run(): Promise<void> {
  try {
    const maxRetries: number = parseInt(core.getInput('maxRetries'), 10)
    const action: string = core.getInput('action')
    const region: string =
      core.getInput('region') || process.env.AWS_DEFAULT_REGION || 'us-east-1'

    const IPSetInputs = getIPSetFromInputs()
    const publicIp = await getPublicIp(maxRetries)

    const NewAddress = `${publicIp}/32`

    if (action === 'add') {
      core.info(`adding: ${NewAddress}`)
      await addIP(NewAddress, IPSetInputs, region)
    } else if (action === 'remove') {
      core.info(`removing: ${NewAddress}`)
      await removeIP(NewAddress, IPSetInputs, region)
    } else {
      throw new Error(
        `'action' of '${action}' not understood. Must be either 'add' or 'remove'`
      )
    }

    core.setOutput('address', NewAddress)
  } catch (error: unknown) {
    if (error instanceof Error) {
      core.setFailed(error.message)
    } else {
      core.setFailed(`Unknown error: ${error}`)
    }
  }
}

export interface IPResponse {
  ip: string
}

function getIPSetFromInputs(): AWS.WAFV2.GetIPSetRequest {
  const Id: string = core.getInput('ipset_id', {required: true})
  const Name: string = core.getInput('ipset_name', {required: true})
  const Scope: string = core.getInput('ipset_scope', {required: true})
  return {Id, Name, Scope}
}

run()
