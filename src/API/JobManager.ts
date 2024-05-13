//----------------------------------------------------------------------------------------------------------------------
//Imports from VUE
//----------------------------------------------------------------------------------------------------------------------
import { ref } from 'vue'
import type { Ref } from 'vue'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM CLASS to get data from Server
//----------------------------------------------------------------------------------------------------------------------
import request from './ajax'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM interfaces
//----------------------------------------------------------------------------------------------------------------------
import type { iGenJobConfig, iJobConfig, iJobList, iJobStat } from '@/interface'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM support functions
//----------------------------------------------------------------------------------------------------------------------
import { formatBytes, secondsToHms } from '@/helpers/formaters'
//----------------------------------------------------------------------------------------------------------------------
//SOCKET.IO for realtime comunication
//----------------------------------------------------------------------------------------------------------------------
import socket from './Socket'
//----------------------------------------------------------------------------------------------------------------------
//MAPTORIUM class to handle JobManager events and rendering
//----------------------------------------------------------------------------------------------------------------------
class MAPTORIUMJOBMANAGER {
  private _jobsList: Ref<Array<iJobList>> = ref([])
  private _jobsStat: { [id: string]: Ref<iJobStat> } = {}
  private _socket = socket
  private _show: Ref<boolean> = ref(false)
  constructor() {
    //When need update job stat
    this._socket.on('stat.job', (data: { ID: string; stat: iJobStat }) => {
      if (this._jobsStat[data.ID]) {
        const etaTime = Math.floor(
          (data.stat.time / (data.stat.total - data.stat.queue)) * data.stat.queue
        )
        this._jobsStat[data.ID].value = {
          ...data.stat,
          progress: Math.floor(((data.stat.total - data.stat.queue) / data.stat.total) * 1000) / 10,
          sizeFormated: formatBytes(data.stat.size),
          timeFormated: secondsToHms(data.stat.time),
          timeETA: secondsToHms(etaTime),
          processed: data.stat.total - data.stat.queue
        }
      }
    })
    // //When need update job stat
    // this._socket.on('stat.gen', (data: { ID: string; stat: GenJobStat }) => {
    //   setJobStat(
    //     data.ID,
    //     data.stat.total - data.stat.procesed,
    //     data.stat.total,
    //     data.stat.time,
    //     data.stat.size,
    //     data.stat.readed,
    //     data.stat.skip,
    //     0
    //   )
    // })
  }
  /**
   * Start/Stop job according current status
   * @param jobID - Job ID
   */
  public async Toggle(jobID: string): Promise<void> {
    this._jobsList.value.forEach(async (item, index) => {
      if (item.ID == jobID) {
        if (item.running) {
          if (await this.Stop(jobID)) {
            this._jobsList.value[index].running = false
          }
        } else {
          if (await this.Start(jobID)) {
            this._jobsList.value[index].running = true
          }
        }
      }
    })
  }
  /**
   * Start job by ID
   * @param jobID - Job ID
   * @returns true if job was started, false in case of any error
   */
  public async Start(jobID: string): Promise<boolean> {
    return (await request(`/job/start/${jobID}`, {}, 'get', true)) as boolean
  }
  /**
   * Stop job by ID
   * @param jobID  - Job ID
   * @returns true if job was stopped, false in case of any error
   */
  public async Stop(jobID: string): Promise<boolean> {
    return (await request(`/job/stop/${jobID}`, {}, 'get', true)) as boolean
  }
  public get stat() {
    return this._jobsStat
  }
  /**
   * Update Jobs list
   */
  public async List() {
    const jobsList = (await request('/job/list', {}, 'get')) as Array<iJobList> | false
    if (jobsList) {
      jobsList.forEach((item) => {
        this._jobsStat[item.ID] = ref({
          download: 0,
          error: 0,
          empty: 0,
          size: 0,
          skip: 0,
          time: 0,
          total: 0,
          queue: 0,
          progress: 0,
          sizeFormated: '0kB',
          timeFormated: '0m 0s',
          timeETA: '0m 0s',
          processed: 0
        })
      })
      this._jobsList.value = jobsList
    }
  }

  public async Add(data: iJobConfig): Promise<void> {
    console.log(data)
    if (await request('/job/download', data, 'post', true)) {
      this.List()
    }
  }

  public async AddGen(data: iGenJobConfig): Promise<void> {
    if (await request('/job/generate', data, 'post', true)) {
      this.List()
    }
  }

  public async Up(jobID: string): Promise<void> {
    if (await request(`/job/up/${jobID}`, {}, 'get', true)) {
      this.List()
    }
  }

  public async Delete(jobID: string): Promise<void> {
    if (await request(`/job/delete/${jobID}`, {}, 'get', true)) {
      this.List()
    }
  }

  public async Down(jobID: string): Promise<void> {
    if (await request(`/job/down/${jobID}`, {}, 'get', true)) {
      this.List()
    }
  }

  /**
   * Return jobs list to be readonly
   */
  public get jobs() {
    return this._jobsList
  }

  public get show() {
    return this._show
  }
}
//----------------------------------------------------------------------------------------------------------------------
//INIT new MAPTORIUM JobManager class
//----------------------------------------------------------------------------------------------------------------------
const JobManager = new MAPTORIUMJOBMANAGER()
//----------------------------------------------------------------------------------------------------------------------
//EXPORT new MAPTORIUM JobManager class
//----------------------------------------------------------------------------------------------------------------------
export default JobManager
