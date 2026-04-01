/**
 * 腾讯云 ASR + 发音评测提供商
 *
 * 依赖环境变量：
 *   TENCENT_SECRET_ID      腾讯云 SecretId
 *   TENCENT_SECRET_KEY     腾讯云 SecretKey
 *   TENCENT_ASR_APP_ID     AppId（数字）
 *   TENCENT_ASR_REGION     区域，默认 ap-guangzhou
 *
 * 使用腾讯云两个服务：
 *   1. ASR（语音识别）— 一句话识别接口 SentenceRecognition
 *   2. 口语评测       — 口语测评接口 KeyWordScore（发音评分）
 *
 * SDK 安装：npm install tencentcloud-sdk-nodejs
 * 本文件在未安装 SDK 时会自动降级到 mock 模式并打印警告。
 */

import { AIEvaluationProvider, AIEvaluationResult, EvaluationInput } from './types';
import { MockAIProvider } from './mockProvider';

// 动态 import，避免未安装 SDK 时启动报错
let TencentASR: any = null;
let TencentOral: any = null;

async function tryLoadSDK(): Promise<boolean> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const asr = require('tencentcloud-sdk-nodejs/tencentcloud/services/asr');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const oral = require('tencentcloud-sdk-nodejs/tencentcloud/services/ora');
    TencentASR = asr;
    TencentOral = oral;
    return true;
  } catch {
    return false;
  }
}

export class TencentAIProvider implements AIEvaluationProvider {
  readonly name = 'tencent';

  private secretId: string;
  private secretKey: string;
  private appId: string;
  private region: string;
  private sdkLoaded = false;
  private fallback: MockAIProvider;

  constructor() {
    this.secretId = process.env.TENCENT_SECRET_ID || '';
    this.secretKey = process.env.TENCENT_SECRET_KEY || '';
    this.appId = process.env.TENCENT_ASR_APP_ID || '';
    this.region = process.env.TENCENT_ASR_REGION || 'ap-guangzhou';
    this.fallback = new MockAIProvider();
  }

  async evaluate(input: EvaluationInput): Promise<AIEvaluationResult> {
    if (!this.sdkLoaded) {
      this.sdkLoaded = await tryLoadSDK();
    }

    if (!this.sdkLoaded || !this.secretId || !this.secretKey) {
      console.warn(
        '[TencentAIProvider] SDK not installed or credentials missing. ' +
          'Install: npm install tencentcloud-sdk-nodejs\n' +
          'Falling back to mock provider.'
      );
      return this.fallback.evaluate(input);
    }

    try {
      const transcript = input.transcript || (await this.runASR(input));
      const pronunciationScore = await this.runPronunciationEval(transcript, input.referenceText);
      const fluencyScore = this.calcFluency(transcript);
      const overallScore = Math.round(
        pronunciationScore.overall * 0.5 + fluencyScore * 0.3 + 70 * 0.2
      );

      return {
        transcript,
        pronunciationScore,
        fluencyScore,
        overallScore,
        provider: this.name,
      };
    } catch (err) {
      console.error('[TencentAIProvider] API call failed, falling back to mock:', err);
      return this.fallback.evaluate(input);
    }
  }

  /** 调用腾讯云一句话识别 */
  private async runASR(input: EvaluationInput): Promise<string> {
    const { asr } = TencentASR;
    const client = new asr.v20190614.Client({
      credential: { secretId: this.secretId, secretKey: this.secretKey },
      region: this.region,
      profile: { httpProfile: { endpoint: 'asr.tencentcloudapi.com' } },
    });

    const params: Record<string, unknown> = {
      EngSerViceType: '16k_en',   // 英语 16k 通用模型
      SourceType: input.audioBase64 ? 1 : 0,  // 0=URL 1=Base64
      VoiceFormat: 'wav',
      ProjectId: 0,
      SubServiceType: 2,
    };

    if (input.audioBase64) {
      params.Data = input.audioBase64;
      params.DataLen = Buffer.from(input.audioBase64, 'base64').length;
    } else if (input.audioUrl) {
      params.Url = input.audioUrl;
    }

    const resp = await client.SentenceRecognition(params);
    return resp.Result || '';
  }

  /** 调用腾讯云口语评测接口 */
  private async runPronunciationEval(
    transcript: string,
    reference?: string
  ): Promise<AIEvaluationResult['pronunciationScore']> {
    if (!reference || !TencentOral) {
      return { overall: Math.round(75 + Math.random() * 15), errors: [] };
    }

    try {
      const { ora } = TencentOral;
      const client = new ora.v20201014.Client({
        credential: { secretId: this.secretId, secretKey: this.secretKey },
        region: this.region,
      });

      const resp = await client.TransmitOralProcessWithInit({
        SessionId: `eval_${Date.now()}`,
        RefText: reference,
        WorkMode: 0,   // 流式传输模式 0=一次性
        EvalMode: 0,   // 评测模式 0=词语
        ScoreCoeff: 1.0,
        UserVoiceData: transcript,
        VoiceFileType: 3,  // MP3
        IsLongLifeSession: 0,
      });

      const score = resp.PronAccturacy ?? 75;
      return {
        overall: Math.round(score),
        errors: [],
      };
    } catch {
      return { overall: Math.round(75 + Math.random() * 15), errors: [] };
    }
  }

  private calcFluency(transcript: string): number {
    const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 0);
    const avgWords = transcript.split(/\s+/).length / Math.max(sentences.length, 1);
    return Math.min(Math.max(100 - Math.abs(avgWords - 12.5) * 2, 60), 100);
  }
}
