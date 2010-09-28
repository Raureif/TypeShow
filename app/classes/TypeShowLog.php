<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of TypeShowLog
 *
 * @author mphasize
 */
class TypeShowLogger {

	protected $timeStart = 0;

	public function __construct(SettingsDatabase $settings) { // Plugin constructor must accept settings
		parent::__construct($settings); //reestablish connection to parent object

		$this->timeStart = $this->getNowTimestamp();
	}

	public function onFinish() {

		$timeEnd = $this->getNowTimestamp();
		$timeTotal = $timeEnd - $this->timeStart;


		$fontProperties = $this->TypeShow->getFontProperties();


		error_log($timeTotal . "\t" .
				date('Y-m-d') . "\t" .
				date('H:i:s') . "\t" .
				$fontProperties['fontFamily'] . "\t" .
				$fontProperties['fontStyle'] . "\t" .
				$this->TypeShow->getSampleString() . "\t" .
				$this->TypeShow->getThemeName() . "\t" .
				$_SERVER['REMOTE_ADDR'] . "\n"
				, 3, TS_ROOT . "/data/plugin-data/PerformanceLog/performance.log");
	}

	// =====================
	// = Private functions =
	// =====================

	private function getNowTimestamp() {
		list($usec, $sec) = explode(' ', microtime());
		return $usec + $sec;
	}

}

?>
